import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { icp } from "./io";
import { env, MarkdownFile } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Searches raw text of a markdown document and returns
 * collection of found headers.
 * > {level: 1, raw: '# Foo Bar', label: 'Foo Bar', link: 'foo-bar'}
 * @param content - raw text of a markdown document.
 * @returns 
 */
export function makeHeaders(content: string) {
  // Fetching any '#' lines in markdown document.
  const lines = content.split("\n").filter((line) => {
    return line.trim().charAt(0) == "#";
  });

  // building a collection of header objects
  return lines.map((line) => {
    let i; // why
    for (
      i = 0;
      i < 6 && `${line.slice(0, i)}#` == line.slice(0, i + 1);
      i++
    ) {/* loop just increments counter & peek at next line character */}

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
}

export function dbConnection(path: string) {
  const Database = require("better-sqlite3");
  const conn = new Database(path, { verbose: console.log });
  tableCheck(conn, env.db_table); 
  return conn;
}

/**
 * Helper function create the default table.
 * @param conn 
 * @param table 
 */
function tableCheck(conn: any, table: string) {
  const stmt = conn.prepare(
    `CREATE TABLE IF NOT EXISTS ${table}('dir' varchar, 'name' varchar, 'content' blob, 'meta' blob);`
  );
  stmt.run();
}


export function select(conn: any, table: string = env.db_table, where='') {
  const rows = conn.prepare(`SELECT * FROM ${table} ${where}`).all() 
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
