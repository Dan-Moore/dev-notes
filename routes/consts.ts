export interface RouteResource {
  md: string;
  db: string;
  log: string;
}

export type AppRoutes = "posts" | "online-resources" | "projects";

export const RouteManager = () => {
  const _resources: Record<AppRoutes, RouteResource> = {
    posts: {
      md: "",
      db: "",
      log: "",
    },
    "online-resources": {
      md: "",
      db: "",
      log: "",
    },
    projects: {
      md: "",
      db: "",
      log: "",
    },
  };

  return {
    resources: _resources,
    processDocuments: ()=> {
        
    }
  };
};
