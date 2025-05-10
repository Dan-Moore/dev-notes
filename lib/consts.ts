import { BookMarked, GraduationCap, Newspaper, Sprout } from "lucide-react";
import path from "path";

export const env = {
  archive: {
    table: process.env.ARCHIVE_TABLE || "md",
    location: process.env.ARCHIVE_DB || "/public/db/archive.db"
  },
  dirs: {
    logs: process.env.LOG_DIR || "app/_log",
    posts: path.join(process.env.MD_DIR || "/public/markdown", "posts"),
    learning: path.join(process.env.MD_DIR || "/public/markdown", "learning"),
  },
  isDev: process.env.NODE_ENV == 'development',
  isProd: process.env.NODE_ENV == 'production',
  options: {
    /**
     * Flag to enable console log out statements.
     */
    print: process.env.PRINT_MODE == 'true' || false,
    /**
     * Flag to enable developer friendly IC print statements.
     */
    ic: process.env.IC_MODE == 'true' || false,
  }
};



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
    title: "Learning Resources",
    url: "/learning",
    icon: GraduationCap,
  },
];
