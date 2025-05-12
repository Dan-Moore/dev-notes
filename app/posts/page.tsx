

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { all } from "@/lib/nightly/io";
import { AppResources } from "@/lib/nightly/consts";
import Link from "next/link";

export default async function Page() {
  const files = await all(AppResources.posts);
  
  return (
    <SidebarProvider defaultOpen={false} 
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset"/>
    <SidebarInset>
      <SiteHeader />
      <div className="grid gap-6 py-6 px-10">
        {files.map((file) => (
          <article key={file.details().title} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={file.slug} className="block space-y-3">
              <h2 className="text-2xl font-bold">{file.details().title}</h2>
              {file.details().description && <p className="text-muted-foreground">{file.details().description}</p>}
              <div className="flex gap-2 pt-2">
                {(file.details().tags) ? file.details().tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {tag}
                  </span>
                )): <></>}
              </div>
            </Link>
          </article>
        ))}
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
}