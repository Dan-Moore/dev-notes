import fs from "fs";
import matter from "gray-matter";
import { env, MarkdownFile, ResourcePaths } from "./consts";
import { contains, dbConnection, join, makeFile, select } from "./utils";

/** Returns a markdown file. While on development mode, local files are loaded in. */
export async function find(rp: ResourcePaths, slug: string): Promise<MarkdownFile> {
  // if on dev - return local before attempting to query db.
  const local_path = join(rp.md, slug + ".mdx");
  if(env.isEnvDev && fs.existsSync(local_path)) {
    return parse(local_path)
  }

  const conn = dbConnection(rp.db);
  const row = select(conn);
  conn.close();
  return makeFile(row.dir, row.name, row.content, row.meta);
}

/** Returns collection of markdown documents.  */
export async function all(rp: ResourcePaths): Promise<MarkdownFile[]> {
  const conn = dbConnection(rp.db);
  const rows = select(conn);
  conn.close();

  const db_files = rows.map((row) =>
    makeFile(row.dir, row.name, row.content, row.meta)
  );
  
  // While on prod - return only files in DB.
  if (env.isEnvProd) {
    return db_files;
  }

  const local_files = await walk(rp.md)

  // Loading in local files over stored files.
  return [
      ...local_files,
      ...db_files.filter((db_file) => {
        contains(db_file, local_files);
      }),
    ];
}

export async function walk(dir: string, files: MarkdownFile[] = []) {

  if (!dir || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }
  print(`running walk(${dir})`);
  if (fs.statSync(dir).isDirectory()) {
    for (const pa of fs.readdirSync(dir).map((file_name) => join(dir, file_name))) {
      walk(pa, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    const file = parse(dir);
    print(`found ${file.name}`);
    files.push(file);
  }

  return files;
}

/**
 * Parses local markdown file with gray-matter.
 * @remarks
 * ```
 * const { data: headers, content } = matter(fs.readFileSync(path));
 * ```
 * @param p - path variable: 'public/markdown/hi.mdx'
 */
function parse(path: string): MarkdownFile {
  const isReal = fs.existsSync(path);
  if (isReal && fs.statSync(path).isDirectory()) {
    throw new Error(`unable to parse(${path}).  Given path was a directory!`);
  } else if (!isReal || !fs.statSync(path).isFile()) {
    throw new Error(
      `Unable to parse(${path})!\nUnknown object failed either fs.existsSync(${path}) or fs.statSync(${path}).isFile().`
    );
  }

  const { data: headers, content } = matter(fs.readFileSync(path));

  return makeFile(
    require('path').dirname(path),
    require('path').basename(path),
    content,
    JSON.parse(JSON.stringify(headers)), // forcing datatypes on local files to match db records.
    true
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
export async function print(...lines: string[]) {
  if (env.options.print) {
    lines.every((line) => console.log(line));
  }
}

/**
 * I C Print statements to console.log()
 * @remarks
 * These print statements are used for debugging the application.
 */
export async function icp(...lines: string[]) {
  if (env.options.icp) {
    lines.every((line) => console.log(line));
  }
}