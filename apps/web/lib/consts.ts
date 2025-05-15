import { BookMarked, GraduationCap, Newspaper, Sprout } from "lucide-react";

export const dev = {
  name: "Dan",
  fullName: "Daniel Moore",
  avatar: "https://avatars.githubusercontent.com/u/1450437",
  email: "to@do.com",
  linkedin: "https://www.linkedin.com/in/daniel-moore-64626140/",
};

export const site = {
  links: [
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
  ],
};
