import fs, { unlink } from "fs";
import path from "path";
import matter from "gray-matter";
import { dirs } from "./consts";

export function posts() {
  // reading only root files in the blog directory.
  const files = directory(`${process.env.MD_DIR}/posts`);
  return files;
}

export interface MarkdownFile {
  readonly dir: string;
  readonly name: string;
  /**
   * Compressed markdown document with zlib.
   * @remarks
   * require("zlib").deflateSync(content).toString("base64")
   */
  readonly content: string;
  /**
   * Dictionary of front-matter headers.
   */
  readonly meta: { [key: string]: any } | {};
  /**
   * Information about the markdown file.
   */
  readonly details: {};
  /**
   * Un-compresses the markdown document with zlib.
   */
  raw: () => string;
}

/**
 * Helper function to make MarkdownFile objects
 */
function make(
  dir: string,
  name: string,
  content: string,
  meta: { [key: string]: any }
) {
  // building file object.
  const file: MarkdownFile = {
    dir: dir,
    name: name,
    meta: meta,
    content: content,
    details: {
      link: `${dir.replace(process.env.MD_DIR, "")}/${name.replace(
        ".mdx",
        ""
      )}`,
      title: meta["title"],
      desc: meta["desc"] ? meta["desc"] : meta["description"],
      tags: meta["tags"],
      publish: meta["publish"] ? new Date(meta["publish"]) : undefined,
    },
    raw: function (): string {
      return require("zlib")
        .inflateSync(Buffer.from(file.content, "base64"))
        .toString();
    },
  };
  return file;
}

/**
 * Parses the file path with gray-matter.
 * @example
 * ```ts
 * const fs_content = fs.readFileSync("" + p);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param p path variable - public/markdown/hi.mdx
 * @returns
 */
export function parse(p: string) {
  // console.log(`running parse(${p})`);
  const isReal = fs.existsSync(p);
  if (isReal && fs.statSync(p).isDirectory()) {
    throw new Error(`unable to parse(${p}).  Given path was a directory!`);
  } else if (!isReal || !fs.statSync(p).isFile()) {
    throw new Error(
      `unable to parse(${p}).  Unknown object failed either fs.existsSync(${p}) or fs.statSync(${p}).isFile().`
    );
  }

  // parsing with gray-matter
  const fs_buffer = fs.readFileSync("" + p);
  const { data: meta, content } = matter(fs_buffer);

  return make(
    path.dirname(p),
    path.basename(p),
    require("zlib").deflateSync(content).toString("base64"),
    meta
  );
}

/**
 * Reads directory with fs.readdirSync() & io.parse().
 * @remarks
 * Doesn't walk through nested folders in a directory,
 * but only grabs the files at the given root directory.
 *
 * @param dir - directory
 * @returns
 */
export function directory(dir: string) {
  const files: MarkdownFile[] = [];
  fs.readdirSync(dir).map((fs_file) => {
    files.push(parse(path.join(dir, fs_file)));
  });
  return files;
}

/**
 * Recursive directory walk.
 * @param dir - /public/markdown/calendar
 * @param files - optional []. List of found files in the dir
 * @returns
 */
export function walk(dir: string, files: MarkdownFile[] = []) {
  if (!dir || dir == undefined || dir == null || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }
  //console.log(`running walk(${dir})`)
  if (fs.statSync(dir).isDirectory()) {
    for (const p of fs.readdirSync(dir).map((name) => path.join(dir, name))) {
      walk(p, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    files.push(parse(dir));
  }

  return files;
}

/**
 * Searches the archive, the local file system for a given file.
 * @throws Error - If given file is missing from archive and local.
 */
export function fetch(dir: string, name: string, table: string = "md") {
  const Database = require("better-sqlite3");
  const db = new Database("public/db/archive.db", { verbose: console.log });
  //console.log(`checking table ${table} for ${dir}/${name}`);
  
  const result = db
    .prepare(`SELECT * FROM ${table} WHERE dir = '${dir}' AND name = '${name}'`)
    .get();

  if (result) {
    //console.log(`found ${dir}/${name} in archive.`)
    return make(result.dir, result.name, result.content, JSON.parse(result.meta));
  } else if(fs.existsSync(path.join(dir, name))) {
    // console.log(`found ${dir}/${name} in local.`)
    const { data: meta, content } = matter(fs.readFileSync(
      path.join(dir, name),
      "utf-8"
      ));
    
    return make(dir, name, require("zlib").deflateSync(content).toString("base64"), meta);
  }

  throw Error(`Missing ${dir}/${name} from archive and markdown directory!`)
}

/**
 *
 * @param files - Markdown documents ready to be stored in SQLiteDB
 * @param table - Table name: defaults to 'md'
 * @param auto_publish - Flag to add a new publish date to the file meta data.
 * @param purge_source - Flag to remove the source file.  By default it's set to false.
 * @param compress - Flag to compress file content with zlib
 * @param location - Path to the archive file
 * @param backup - Flag to preserve the prior archive
 */
export function archive(
  files: MarkdownFile[],
  table: string = "md",
  auto_publish: boolean = true,
  location: string = "public/db/archive.db"
) {
  // Deleting prior archive
  unlink(location, (err) => {
    if (err) throw err;
    console.log(`Deleting SQLite archive at: ${location}`);
  });
  fs.closeSync(fs.openSync(location, "w")); // touching new file.

  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });

  // Re-creating the new table.
  const stmt = db.prepare(
    `CREATE TABLE IF NOT EXISTS ${table}('dir' varchar, 'name' varchar, 'content' blob, 'meta' blob);`
  );
  stmt.run();

  // Inserting files as transactions
  const insert = db.prepare(
    `INSERT INTO ${table} (dir, name, content, meta) VALUES (@dir, @name, @content, @meta)`
  );
  const insertMany = db.transaction((x) => {
    for (const file of x) insert.run(file);
  });

  insertMany(
    files.map((file) => {
      return {
        dir: file.dir,
        name: file.name,
        content: file.content,
        meta: JSON.stringify(file.meta),
      };
    })
  );
}


