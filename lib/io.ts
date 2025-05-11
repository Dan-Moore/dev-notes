import fs, { unlink } from "fs";
import path from "path";
import matter from "gray-matter";
import { env } from "./consts";

/**
 * Returns markdown pages stored in posts.db
 * @remarks
 * When building locally in developer mode. Non publish pages
 * will be visible. Local markdown files in `/public` will be rendered.
 *
 * `npm run dev`
 * @returns
 * Collection of MarkdownFile found with posts
 */
export function posts() {
  return retrieve(env.paths.md, env.paths.db.posts);
}

/**
 * Returns markdown pages stored in online-resources.db
 * @remarks
 * When building locally in developer mode. Non publish pages
 * will be visible. Local markdown files in `/public` will be rendered.
 *
 * `npm run dev`
 * @returns
 * Collection of MarkdownFile found with online_resources
 */
export function online_resources() {
  return retrieve(env.paths.online_resources);
}

/**
 * Returns markdown pages stored in projects.db
 * @remarks
 * When building locally in developer mode. Non publish pages
 * will be visible. Local markdown files in `/public` will be rendered.
 *
 * `npm run dev`
 * @returns
 * Collection of MarkdownFile found with projects
 */
export function projects() {
  return retrieve(env.paths.projects);
}

/**
 * Returns markdown pages stored in wikis.db
 * @remarks
 * When building locally in developer mode. Non publish pages
 * will be visible. Local markdown files in `/public` will be rendered.
 *
 * `npm run dev`
 * @returns
 * Collection of MarkdownFile found with wikis
 */
export function wikis() {
  return retrieve(env.paths.wikis);
}

/**
 * Retrieves a collection of MarkdownFile for a given directory.
 * @remark
 * While in production mode, only return files from archive.db
 * @param dir - Directory path
 */
export function retrieve(dir: string, location: string) {
  if (env.isEnvProd) {
    return read(dir, location);
  }

  // Merging local md files with database files
  // when in 'development' or 'test' environment.
  const isMatch = function (x: MarkdownFile, y: MarkdownFile) {
    icp(
      `[${x.dir}, ${y.dir}] ${x.dir == y.dir} && [${x.name}, ${y.name}] ${
        x.name == y.name
      } == ${x.dir == y.dir && x.name == y.name}`
    );
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
  readonly details: {
    link: string;
    title: string;
    desc: string;
    tags: string[];
    publish?: Date;
    /**
     * Defaults to a new date, if missing from front-matter header.
     */
    modified: Date;
    /**
     * Flag for draft mode, defaults to 'true'
     */
    draft: boolean | true;
  };
  /**
   * Un-compresses the markdown document with zlib.
   */
  raw: () => string;
  /**
   * H# headers found within the document.
   */
  headers: () => { level: number; raw: string; label: string; link: string }[];
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
      // stripping the root directory and removing file extension.
      link: `${dir.replace(
        process.env.MD_DIR || "public/markdown",
        ""
      )}/${name.replace(".mdx", "")}`,
      title: meta["title"],
      desc: meta["desc"] ? meta["desc"] : meta["description"],
      tags: meta["tags"],
      draft: meta["draft"] ? meta["draft"] == "true" : true,
      publish: meta["publish"] ? new Date(meta["publish"]) : undefined,
      modified: meta["modified"] ? new Date(meta["modified"]) : new Date(),
    },
    raw: function (): string {
      return require("zlib")
        .inflateSync(Buffer.from(file.content, "base64"))
        .toString();
    },
    headers: function () {
      // Fetching header lines
      const lines = content.split("\n").filter((line) => {
        return line.trim().charAt(0) == "#";
      });

      // building headers
      return lines.map((line) => {
        let i; // why
        for (
          i = 0;
          i < 6 && `${line.slice(0, i)}#` == line.slice(0, i + 1);
          i++
        ) {}

        return {
          level: i,
          raw: line,
          label: line.slice(i + 1),
          link: line
            .slice(i + 1)
            .toLowerCase()
            .replaceAll(" ", "-"),
        };
      });
    },
  };

  return file;
}

/**
 * Parses local markdown file with gray-matter.
 * @remarks
 * ```
 * const fs_content = fs.readFileSync(p);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param p - path variable: 'public/markdown/hi.mdx'
 * @returns
 */
function parse(p: string) {
  const isReal = fs.existsSync(p);
  if (isReal && fs.statSync(p).isDirectory()) {
    throw new Error(`unable to parse(${p}).  Given path was a directory!`);
  } else if (!isReal || !fs.statSync(p).isFile()) {
    throw new Error(
      `Unable to parse(${p})!\nUnknown object failed either fs.existsSync(${p}) or fs.statSync(${p}).isFile().`
    );
  }

  const { data: headers, content } = matter(fs.readFileSync(p));
  // JSON.parse here is redundant.
  // Forcing data type to match with a MarkdownFile
  // retrieved from the database.
  return make(
    path.dirname(p),
    path.basename(p),
    content,
    JSON.parse(JSON.stringify(headers)),
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
  icp(`local(${dir}) = ${JSON.stringify(files)}`);
  return files;
}

/**
 * Recursive directory walk.
 * @param dir - directory path: /public/markdown/posts
 * @param files - directory files, defaults to [] on first walk call.
 * @returns
 */
export function walk(dir: string, files: MarkdownFile[] = []) {
  if (!dir || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }
  print(`running walk(${dir})`);
  if (fs.statSync(dir).isDirectory()) {
    // p - path variable to re-run the walk command on.
    for (const p of fs.readdirSync(dir).map((name) => path.join(dir, name))) {
      walk(p, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    const file = parse(dir);
    print(`found ${file.name}`);
    files.push(file);
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
  location: string,
  table: string = env.db_table,
) {
  // Checking the db for given file name.
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });
  const row = db
    .prepare(`SELECT * FROM ${table} WHERE name = '${name}'`)
    .get();

  if (row) {
    print(`Found ${name} in db.`);
    return make(row.dir, row.name, row.content, JSON.parse(row.meta));
  } else if (fs.existsSync(path.join(row.dir, name))) {
    print(`Found ${name} in local markdown directory.`);
    const { data: meta, content } = matter(
      fs.readFileSync(path.join(row.dir, name), "utf-8")
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
  location: string,
  table: string = env.db_table,
) {
  const Database = require("better-sqlite3");
  const db = new Database(location, { verbose: console.log });
  const files: MarkdownFile[] = [];

  for (const row of db
    .prepare(`SELECT * FROM ${table} WHERE dir = '${dir}'`)
    .all()) {
    files.push(make(row.dir, row.name, row.content, JSON.parse(row.meta)));
  }

  icp(`read(${dir},${table}, ${location}) = ${JSON.stringify(files)}`);
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
  location: string,
  table: string = env.db_table,
) {
  // todos:
  //  - add backup feature?
  //  - test - row count vs source files
  //  - test - read file from new db.

  // Deleting prior archive
  unlink(location, (err) => {
    if (err) throw err;
    print(`Deleting SQLite archive at: ${location}`);
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

/**
 * Prints lines to console.log()
 * @remarks
 * ```
 * if (env.options.print) {
 *   lines.every(line => console.log(line));
 * }
 * ```
 */
export function print(...lines: string[]) {
  if (env.options.print) {
    lines.every((line) => console.log(line));
  }
}

/**
 * I C Print statements to console.log()
 * @remarks
 * These print statements are used for debugging the application.
 */
export function icp(...lines: string[]) {
  if (env.options.icp) {
    lines.every((line) => console.log(line));
  }
}

/**
 * Writes to the log file.
 * @remarks
 * If file path doesn't point to an existing file,
 * a new log file will be written.
 * @param args - Contains file path & logging options
 */
export function log(
  args: { location: string; overwrite: boolean },
  lines: string[]
) {
  // Creating a new log file, if not found.
  if (!fs.existsSync(args.location)) {
    fs.closeSync(fs.openSync(args.location, "w"));
  }

  if (args.overwrite) {
    fs.writeFileSync(args.location, lines.join("\n") + "\n");
  } else {
    fs.appendFileSync(args.location, lines.join("\n") + "\n");
  }
}

/** 
 *  Wrapper to log MarkdownFile[] entities.
// Using slice()
const newString1: string = myString.slice(0, -1)
*/
export function logger(
  args: { location: string; overwrite: boolean },
  files: MarkdownFile[]
) {
  let lines = files.map(
    (f) =>
      JSON.stringify({
        path: path.join(f.dir, f.name),
        publish: f.details.publish?.toISOString() || "",
        modified: f.details.modified.toISOString(),
        title: f.details.title,
        tags: f.details.tags,
      }) + "," // Adding a tailing ',' for future entries.
  );
  // Removing the tailing ',' on the last entry.
  lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
  return log(args, ["[", ...lines, "]"]);
}
