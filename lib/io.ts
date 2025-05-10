import fs, { unlink } from "fs";
import path from "path";
import matter from "gray-matter";
import { env } from "./consts";

/**
 * Retrieves a collection of MarkdownFile for a given directory.
 * @remark
 * While in production mode, only return files from archive.db
 * @param dir
 * @returns
 */
export function retrieve(dir: string) {
  // todo - on hosted GH page, I only want markdown files from db.
  const isProd = false;
  if (isProd) {
    return read(dir);
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

export function getPosts() {

  console.log("foo =" + process.env.NODE_ENV)
  return retrieve(env.dirs.posts);
}

export function getLearning() {
  return retrieve(env.dirs.learning);
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
 * Helper function to build MarkdownFile objects.
 * @remarks
 * When working with local markdown files, use the compress flag.
 * ```
 * content: compress
      ? require("zlib").deflateSync(content).toString("base64")
      : content,
 * ```
 * @param compress - Flag to compress file with zlib. 
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
 * Parses local markdown file with gray-matter.
 * @example
 * ```ts
 * const fs_content = fs.readFileSync("" + p);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param p path variable - public/markdown/hi.mdx
 * @returns
 */
function parse(p: string) {
  // console.log(`running parse(${p})`);
  const isReal = fs.existsSync(p);
  if (isReal && fs.statSync(p).isDirectory()) {
    throw new Error(`unable to parse(${p}).  Given path was a directory!`);
  } else if (!isReal || !fs.statSync(p).isFile()) {
    throw new Error(
      `unable to parse(${p}).  Unknown object failed either fs.existsSync(${p}) or fs.statSync(${p}).isFile().`
    );
  }

  const fs_buffer = fs.readFileSync("" + p);
  const { data: meta, content } = matter(fs_buffer);

  // Wrapping meta around JSON.parse to match
  // file type of MarkdownFiles read in from db.
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
  fs.readdirSync(dir).map((file) => {
    files.push(parse(path.join(dir, file)));
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
  if (!dir || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }
  //console.log(`running walk(${dir})`)
  if (fs.statSync(dir).isDirectory()) {
    // p - path variable to re-run the walk command on.
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
  table: string = env.archive.table,
  location: string = env.archive.location
) {
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });

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
      content,
      meta,
      true // Compress flag, content is raw text atm.
    );
  }

  throw Error(
    `Missing ${dir}/${name} from archive and local markdown directory!`
  );
}

/**
 * Retrieves directory files from archive.db
 * @param dir
 * @param location
 */
export function read(
  dir: string,
  table: string = env.archive.table,
  location: string = env.archive.location
) {
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });
  const files: MarkdownFile[] = [];
  console.log("bar=[] " + table + location)
  for (const row of db
    .prepare(`SELECT * FROM ${table} WHERE dir = '${dir}'`)
    .all()) {
    files.push(make(row.dir, row.name, row.content, JSON.parse(row.meta)));
  }

  return files;
}

/**
 * Stores markdown documents to archive.db
 * @param files - Markdown documents ready to be stored in SQLiteDB
 * @param table - Table name: defaults to 'md'
 * @param location - Path to the archive file
 */
export function archive(
  files: MarkdownFile[],
  table: string = env.archive.table,
  location: string = env.archive.location
) {
  // todos:
  //  - add backup feature?
  //  - test - row count vs source files
  //  - test - read file from new db.            

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

export function restore(
  table: string = env.archive.table,
  location: string = env.archive.location
) {
  // todo - build md files from archive db.
}
