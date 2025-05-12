import { join } from "./utils";

export interface DevNote {
  title: string
  description: string
  markdown: {
    file: MarkdownFile
    headers: MarkdownHeader[]
    content: string
  }
  /** FrontMatter header in markdown document. */
  tags: string[]
  /** Flag if file is viewable on prod. Default is false. */
  draft: boolean
  /** Publication date - can be undefined. */
  publish?: Date
  modified: Date
  getSlug(): string
}

export interface MarkdownFile {
  readonly slug: string;
  readonly name: string;
  /**
   * Compressed markdown document with zlib.
   * @remarks
   * ```
   * const content = require("zlib").deflateSync(raw_text).toString("base64")
   * ```
   */
  readonly content: string;
  /**
   * Dictionary of front-matter headers.
   */
  readonly meta: { [key: string]: any } | {};
}



export interface MarkdownHeader {
  raw: string
  level: number
  link: string
  label: string
}

/**
 * Base paths of App Router pages.
 */
const routes = {
  posts: "/posts",
  "online-resources": "/online-resources",
  projects: "/projects",
  wiki: "/wiki",
};

/**
 * Root paths to application resources.
 */
const roots = {
  md: process.env.MD_DIR || "/public/markdown",
  log: process.env.LOG_DIR || "app/_logs",
  db: process.env.DB_DIR || "app/_dbs",
};

/**
 * Resource directories for AppRoutes 
 */
export const AppResources: Record<AppRoutes, ResourcePaths> = {
  posts: {
    md: join(roots.md, routes.posts),
    db: join(roots.db, routes.posts),
    log: join(roots.log, routes.posts),
  },
  "online-resources": {
    md: join(roots.md, routes["online-resources"]),
    db: join(roots.db, routes["online-resources"]),
    log: join(roots.log, routes["online-resources"]),
  },
  projects: {
    md: join(roots.md, routes.projects),
    db: join(roots.db, routes.projects),
    log: join(roots.log, routes.projects),
  },
  wikis: {
    md: join(roots.md, routes.wiki),
    db: join(roots.db, routes.wiki),
    log: join(roots.log, routes.wiki),
  },
};

export type AppRoutes = "posts" | "online-resources" | "projects" | "wikis";
export interface ResourcePaths {
  md: string;
  db: string;
  log: string;
}

/**
 * Application's .env variables
 */
export const env = {
  /**
   * .env file path variables
   */
  db_table: process.env.DB_TABLE || "md",
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
 * Dev Note's page links.
 * @remarks
 * Used in creating links for header and footer.
 */
export const page_links = [
  {
    title: "Wiki",
    url: routes.wiki,
    icon: require("lucide-react").BookMarked,
  },
  {
    title: "Posts",
    url: routes.posts,
    icon: require("lucide-react").Newspaper,
  },
  {
    title: "Projects",
    url: routes.projects,
    icon: require("lucide-react").Sprout,
  },
  {
    title: "Online Resources",
    url: routes["online-resources"],
    icon: require("lucide-react").GraduationCap,
  },
];