import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { icp } from "./io";
import { DevNote, env, MarkdownFile, MarkdownHeader } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Builds database connection with better-sqlite3 */
export function dbConnection(path: string) {
  const Database = require("better-sqlite3");
  const conn = new Database(path, { verbose: console.log });
  tableCheck(conn, env.db_table);
  return conn;
}

/** Helper function create the default table. */
function tableCheck(conn: any, table: string) {
  const stmt = conn.prepare(
    `CREATE TABLE IF NOT EXISTS ${table}('dir' varchar, 'name' varchar, 'content' blob, 'meta' blob);`
  );
  stmt.run();
}

export function join(root: string, path: string) {
  return require("path").join(root, path);
}

export const isMatch = function (x: MarkdownFile, y: MarkdownFile) {
  icp(
    `[${x.slug}, ${y.slug}] ${x.slug == y.slug} && [${x.name}, ${y.name}] ${
      x.name == y.name
    } == ${x.slug == y.slug && x.name == y.name}`
  );
  return x.slug == y.slug && x.name == y.name;
};

export const contains = function (x: MarkdownFile, arr: MarkdownFile[]) {
  return arr.find((y) => isMatch(x, y));
};

/** @returns conn.prepare(`SELECT * FROM ${table} ${where}`).all() */
export function select(conn: any, where = "", table: string = env.db_table) {
  const rows = conn.prepare(`SELECT * FROM ${table} ${where}`).all();
  return rows;
}

export function insert(
  conn: any,
  table: string = env.db_table,
  ...files: MarkdownFile[]
) {
  // Inserting files as transactions
  const insert = conn.prepare(
    `INSERT INTO ${table} (dir, name, content, meta) VALUES (@dir, @name, @content, @meta)`
  );

  const insertMany = conn.transaction((new_row: any) => {
    for (const row of new_row) {
      insert.run(row);
    }
  });

  // Running transactions.
  insertMany(
    // Building
    files.map((file) => {
      return {
        slug: file.slug,
        name: file.name,
        content: file.content,
        meta: JSON.stringify(file.meta),
      };
    })
  );
}

export function fetchHeaders(raw: string): MarkdownHeader[] {
  const raw_headers = raw.split("\n").filter((line) => {
    return line.trim().charAt(0) == "#";
  });

  const headers = raw_headers.map((_raw) => {
    let i; // why
    for (i = 0; i < 6 && `${_raw.slice(0, i)}#` == _raw.slice(0, i + 1); i++) {
      /* loop just increments counter & peek at next line character */
    }

    const label = _raw.slice(i + 1);

    const header: MarkdownHeader = {
      raw: _raw,
      level: i,
      label: label,
      link: label.toLowerCase().replaceAll(" ", "-"),
    };
    return header;
  });

  return headers;
}

export function makeFile(
  slug: string,
  name: string,
  content: string,
  meta: any,
  compress: boolean = false
) {
  const file: MarkdownFile = {
    slug: slug,
    name: name,
    content: compress
      ? require("zlib").deflateSync(content).toString("base64")
      : content,
    meta: meta,
  };

  return file;
}

export function makeNote(file: MarkdownFile): DevNote {
  // uncompressing file contents
  const content = require("zlib")
    .inflateSync(Buffer.from(file.content, "base64"))
    .toString();

  const meta = file.meta // pulling this out to shorten . train

  return {
    title: meta['title'],
    description: meta['desc'] ? meta['desc'] : meta['description'],
    markdown: {
      file: file,
      headers: fetchHeaders(content),
      content: content,
    },
    tags: meta['tags'] ? meta['tags'] : [],
    draft: meta['draft'] ? meta['draft'] == 'false' : true,
    modified: meta['modified']? meta['modified'] : new Date(),
    getSlug() {return this.markdown.file.slug},
  };
}

/**
 * Writes to the log file.
 * @remarks
 * If file path doesn't point to an existing file,
 * a new log file will be written.
 * @param args - Contains file path & logging options

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

export function logger(
  args: { location: string; overwrite: boolean },
  files: MarkdownFile[]
) {
  let lines = files.map(
    (f) =>
      JSON.stringify({
        slug: f.slug,
        publish: f.details().publish?.toISOString() || "",
        modified: f.details().modified.toISOString(),
        title: f.details().title,
        tags: f.details().tags,
      }) + "," // Adding a tailing ',' for future entries.
  );
  // Removing the tailing ',' on the last entry.
  lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
  return log(args, ["[", ...lines, "]"]);
}
  */
