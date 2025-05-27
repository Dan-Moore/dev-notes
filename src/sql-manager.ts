import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { DocumentEntity } from "./content-manager.ts";

/** Local consts */
const _ = {
  db: {
    memory: ":memory:",
    main_table: "markdown",
    // todo - see if I can refactor this out.
    cols: { path: "path", body: "body", kv: "kv" },
  },
  paths: { archive: "./content/archive.db" },
};

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/** Builds a string of column names */
function columns(markdown: DocumentEntity | Record<string, unknown>): string {
  return Object.keys(markdown).map((column) => column).join(",");
}

/** Builds a string of '?' - based on the fields contained within MarkdownEntity */
function questions(markdown: DocumentEntity | Record<string, unknown>): string {
  return Object.keys(markdown).map(() => "?").join(",");
}

/** 
 * Sqlite helper object. Creates a new connection when SqlManager i
 * to store and retreive documents.
 * 
 * @example
 * ```
 * const manager =  SqlManager();
 * const docs = manager.all();
 * manager.close();
 * ```
 * 
 * @see SqlManager.close()
 */
export const SqlManager = () => {
  // Opening new connection to database
  const connection = new DatabaseSync(_.paths.archive);

  // Checking if db has table
  const hasTable = (table: string = _.db.main_table) => {
    const statement = connection.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
    );
    const result = statement.get();
    return result ? true : false;
  };

  // Adding table if missing.
  if (!hasTable()) {
    connection.exec(
      `CREATE TABLE ${_.db.main_table}(${_.db.cols.path} TEXT PRIMARY KEY NOT NULL, ${_.db.cols.body} BLOB NOT NULL, ${_.db.cols.kv} BLOB)`,
    );
  }

  // Returning SqlManager
  return {
    /** closes the database connection. */
    close: () => {
      connection.close;
    },
    /** Returns all database records as FileEntity objects.  */
    all: () => {
      const query = select(connection);
      return query.toArray();
    },
    select: (path: string) => {
      // todo - refactor this.
      const query = select(
        connection,
        _.db.main_table,
        "*",
        `WHERE ${_.db.cols.path} = '${path}'`,
      );
      return query.toArray()[0];
    },
    /** Insert mardown files into db  */
    upsert: (
      records: Record<string, unknown>[],
       table: string = _.db.main_table,
    ) => {
      // do nothing
      if (!records || records.length == 0) {
        return;
      }

      // building sql statement - columns are set using the first record as a template.
      const sql = `INSERT OR REPLACE INTO ${table} (${
        columns(records[0])
      }) VALUES (${questions(records[0])}) `;

      const statement = connection.prepare(sql);

      // Running the batch inserts
      for (const record of records) {
        // Using JSON.stringify on any Record
        const values: SQLInputValue[] = Object.values(record).map((value) => {
          if(isRecord(value)) {
            return JSON.stringify(value);
          }
          return value as SQLInputValue;
        })
        statement.run(...values);
      }
    },
  };
};




/** Opens a new connection to a sqlite database. */
function makeConnection(path: string) {
  // todo - checks on valid path
  const connection = new DatabaseSync(path);

  // Helper function to checking if the main table exists.
  // todo - clean up
  const hasTable = (table: string = _.db.main_table) => {
    const statement = connection.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
    );
    const result = statement.get();
    return result ? true : false;
  };
  // Adding table if missing.
  if (!hasTable()) {
    connection.exec(
      `CREATE TABLE ${_.db.main_table}(${_.db.cols.path} TEXT PRIMARY KEY NOT NULL, ${_.db.cols.body} BLOB NOT NULL, ${_.db.cols.kv} BLOB)`,
    );
  }

  return connection;
}



/**
 * Generator function that yields database records.
 * @param table database table name - defaults 'markdown'
 * @param path sqlite db location - defaults to ':memory:'
 * @param select sql select query - defaults to '*'
 * @param where sql where clause - optional argument
 * @param orderBy sql order by clause - optional argument
 */
function* select(
  connection: DatabaseSync,
  table: string = _.db.main_table,
  select: string = "*",
  where?: string,
  orderBy?: string,
) {
  const sql = `SELECT ${select} FROM ${table} ${where ? where : ""} ${
    orderBy ? orderBy : ""
  }`;
  console.log(sql);
  const statement = connection.prepare(sql);

  for (const record of statement.all()) {
    // record values are stored as SQLOutputValue.
    const _path = record[_.db.cols.path] as string;
    const _body = record[_.db.cols.body] as string; // stored as base64 string
    const _kv = JSON.parse(record[_.db.cols.kv] as string); // kv records are stored as a JSON string

    // yielding database record.
    const md: DocumentEntity = {path: _path, body: _body, kv:_kv};
    yield md;
  }
}
