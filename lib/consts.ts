import { BookMarked, GraduationCap, Newspaper, Sprout } from "lucide-react";
import path from "path";

/**
 * Collection of commonly used local variables.
 */
export const local = {
  dirs: {
    // Project Root Directories
    md: process.env.MD_DIR || "/public/markdown",
    log: process.env.LOG_DIR || "app/_logs",
    db: process.env.DB_DIR || "app/_dbs",
  },
};


/**
 * Application's .env variables
 */
export const env = {
  /**
   * .env file path variables
   */
  paths: {
    md: {
      posts: path.join(local.dirs.md, "posts"),
      online_resources: path.join(local.dirs.md, "online-resources"),
      projects: path.join(local.dirs.md, "projects"),
      wikis: path.join(local.dirs.md, "wikis"),
    },
    logs: {
      posts: path.join(local.dirs.log, "posts"),
      online_resources: path.join(local.dirs.log, "online-resources"),
      projects: path.join(local.dirs.log, "projects"),
      wikis: path.join(local.dirs.log, "wikis"),
    },
    db: {
      posts: path.join(local.dirs.db, "posts"),
      online_resources: path.join(local.dirs.db, "online-resources"),
      projects: path.join(local.dirs.db, "projects"),
      wikis: path.join(local.dirs.db, "wikis"),
    },
  },
  db_table: process.env.DB_TABLE || "app/_dbs",
  isEnvDev: process.env.NODE_ENV == "development",
  isEnvProd: process.env.NODE_ENV == "production",
  isEnvTest: process.env.NODE_ENV == "test",
  options: {
    /**
     * Flag to enable console log out statements.
     */
    print: process.env.PRINT_MODE == "true" || false,
    /**
     * Flag to enable developer friendly IC print statements.
     */
    icp: process.env.IC_PRINT_MODE == "true" || false,
  },
};

/**
 * Sqlite table name. Defaults to 'md'
 */
export const table_name = process.env.DB_TABLE || "md";

/**
 * Dev Note's page links.
 * @remarks
 * Used in creating links for header and footer.
 */
export const page_links = [
  {
    title: "Wiki",
    url: "/wiki",
    icon: BookMarked,
  },
  {
    title: "Posts",
    url: "/posts",
    icon: Newspaper,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Sprout,
  },
  {
    title: "Online Resources",
    url: "/online-resources",
    icon: GraduationCap,
  },
];

export interface MarkdownFile {
  readonly slug: string;
  readonly name: string;
  /**
   * Compressed markdown document with zlib.
   * @remarks
   * const content = require("zlib").deflateSync(raw_text).toString("base64")
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
   * H# headers found within the document.
   * > {level: 1, raw: '# Foo Bar', label: 'Foo Bar', link: 'foo-bar'}
   */
  headers: ()=> { level: number; raw: string; label: string; link: string }[];
  /**
   * Un-compresses the markdown document with zlib, when needed.
   */
  raw: () => string;
}