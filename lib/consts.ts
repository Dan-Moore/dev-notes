import { BookMarked, GraduationCap, Newspaper, Sprout } from "lucide-react"
import path from "path"

/**
 * Directory path variables
 * @remark
 * export const dirs = {
 *  posts: path.join(process.env.MD_DIR || '/public/markdown', 'posts'),
 *  learning: path.join(process.env.MD_DIR || '/public/markdown', 'learning'),
 * };
 */
export const dirs = {
    posts: path.join(process.env.MD_DIR || '/public/markdown', 'posts'),
    learning: path.join(process.env.MD_DIR || '/public/markdown', 'learning'),
}

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
  ]