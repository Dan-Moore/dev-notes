import fs, { unlink } from "fs";
import path from "path";
import matter from "gray-matter";
import { dirs } from "./consts";

/**
 * Retrieves a collection of MarkdownFile for a given directory.
 * @remark 
 * While in production mode, only return files from archive.db 
 * @param dir
 * @returns
 */
export function retrieve(dir: string) {
  const isProd = false;
  if (isProd) {
    // only display pages
    return read(dir); // from the archive.db
  }

  const isMatch = function (x: MarkdownFile, y: MarkdownFile) {
    return x.dir == y.dir && x.name == y.name;
  };

  const contains = function (x: MarkdownFile, arr: MarkdownFile[]) {
    return arr.find((y) => isMatch(x, y));
  };

  // Overwrite any archive files with local content.
  let _local = local(dir);
  return [
    ..._local,
    ...read(dir).filter((file) => {
      contains(file, _local);
    }),
  ];
}

export function posts() {
  return retrieve(`${process.env.MD_DIR}/posts`)
}

export function learningResources() {
  return retrieve(`${process.env.MD_DIR}/learning`)
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
  meta: { [key: string]: any },
  compress: boolean = false
) {
  // building file object.
  const file: MarkdownFile = {
    dir: dir,
    name: name,
    meta: meta,
    content: compress
      ? require("zlib").deflateSync(content).toString("base64")
      : content,
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
    content,
    JSON.parse(JSON.stringify(meta)),
    true
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
export function local(dir: string) {
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
 * Searches the archive database for the given file.
 * @remarks
 * If missing from
 * @throws Error - If given file is missing from archive and local.
 */
export function fetch(
  dir: string,
  name: string,
  table: string = "md",
  location: string = "public/db/archive.db"
) {
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });
  //console.log(`checking table ${table} for ${dir}/${name}`);

  const row = db
    .prepare(`SELECT * FROM ${table} WHERE dir = '${dir}' AND name = '${name}'`)
    .get();

  if (row) {
    //console.log(`found ${dir}/${name} in archive.`)
    return make(row.dir, row.name, row.content, JSON.parse(row.meta));
  } else if (fs.existsSync(path.join(dir, name))) {
    // console.log(`found ${dir}/${name} in local.`)
    const { data: meta, content } = matter(
      fs.readFileSync(path.join(dir, name), "utf-8")
    );

    return make(
      dir,
      name,
      require("zlib").deflateSync(content).toString("base64"),
      meta
    );
  }

  throw Error(`Missing ${dir}/${name} from archive and markdown directory!`);
}

/**
 * Retrieves directory files from archive.db
 * @param dir
 * @param location
 */
export function read(
  dir: string,
  table: string = "md",
  location: string = "public/db/archive.db"
) {
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });
  const files: MarkdownFile[] = [];
  for (const row of db
    .prepare(`SELECT * FROM ${table} WHERE dir = '${dir}'`)
    .all()) {
    files.push(make(row.dir, row.name, row.content, JSON.parse(row.meta)));
  }

  return files;
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
