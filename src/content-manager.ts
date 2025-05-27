import { FileManager } from "./file-manager.ts";
import { SqlManager } from "./sql-manager.ts";
/**
 * Markdown Entity object.
 *
 * @todo review - forcing myself to use a tuple. This is getting re-used between db and io calls.
 *
 * @field path - file path of markdown document.
 * @field body - text document compressed as a base64 string.
 * @field kv - key-value pair records associated with the markdown document.
 *
 * @see FileManager - Utilility functions for working with base64 strings.
 */
export type MarkdownEntity = {
  path: string,
  body: string,
  kv: Record<string, unknown>,
};



/** archives local content files to db */
export async function archive() {
  const docs = await FileManager().walk();
  await SqlManager().upsert(docs);
}

/** loads in markdown documents, either from file io or db calls. */
export async function fetchContent(path: string): Promise<MarkdownEntity> {
  const local_doc = await FileManager().parse("./" + path);
  const db_doc = SqlManager().select(path);

  // todo -check if dev or prod
  if(f_body) {
    // appending any found kv data from the database. 
    return  [f_path, FileManager().inflate(f_body), (db_kv)? {...f_kv, ...db_kv} : f_kv] 
  }
  
  return [db_path, FileManager().inflate(db_body), db_kv]
}
