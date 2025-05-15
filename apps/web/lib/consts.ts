import { GraduationCap, Newspaper, Sprout } from "lucide-react";

export const dev = {
  name: "Dan",
  fullName: "Daniel Moore",
  avatar: "https://avatars.githubusercontent.com/u/1450437",
  email: "to@do.com",
  linkedin: "https://www.linkedin.com/in/daniel-moore-64626140/",
};

export interface NavLink {
  slug: string;
  label: string;
  icon?: any;
}

export interface SiteConfig {
  pages: {
    primary: NavLink[];
    static: Record<string, NavLink>;
  };
}

export const site: SiteConfig = {
  pages: {
    primary: [
      {
        label: "Posts",
        slug: "/posts",
        icon: Newspaper,
      },
      {
        label: "Projects",
        slug: "/projects",
        icon: Sprout,
      },
      {
        label: "Learning Resources",
        slug: "/learning",
        icon: GraduationCap,
      },
    ],
    static: {
      about: {
        label: "About",
        slug: "/about",
        icon: undefined,
      },
    },
  },
};
