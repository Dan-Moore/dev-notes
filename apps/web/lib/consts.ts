export const dev = {
  // todo - update with .env
  name: "Dan",
  fullName: "Daniel Moore",
  email: "to@do.com",
  rss: "/",
  avatar: "https://avatars.githubusercontent.com/u/1450437",
  github: "/",
  linkedin: "https://www.linkedin.com/in/daniel-moore-64626140/",
};

export interface iNavLink {
  [x: string]: any;
  slug: string;
  label: string;
}

export interface iNavIcon extends iNavLink {
  icon: string;
}

export interface icon {
  label: string;
  icon: any;
}

export type StaticPage = "home" | "about";
export interface iSiteConfig {
  pages: {
    primary: iNavIcon[];
    static: Record<StaticPage, iNavLink>;
  };
  icons: {
    settings: icon;
    search: icon;
  };
}

export const site: iSiteConfig = makeSiteConfig();

function makeSiteConfig(): iSiteConfig {
  const lucide = require("lucide-react");
  return {
    pages: {
      primary: [
        {
          label: "Posts",
          slug: "/posts",
          icon: require("lucide-react").Newspaper,
        },
        {
          label: "Projects",
          slug: "/projects",
          icon: require("lucide-react").Sprout,
        },
        {
          label: "Learning Resources",
          slug: "/learning",
          icon: require("lucide-react").GraduationCap,
        },
      ],
      static: {
        about: {
          label: "About",
          slug: "/about",
        },
        home: {
          label: "Home",
          slug: "/",
        },
      },
    },
    icons: {
      settings: {
        label: "Settings",
        icon: lucide.Settings,
      },
      search: {
        label: "Search",
        icon: lucide.Settings,
      },
    },
  };
}