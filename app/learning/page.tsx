import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "./data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { resources } from "@/lib/io"
import fs from "fs";
import { dirs } from "@/lib/consts";


// generateStaticParams generates static paths for blog posts.
// This function is called at build time.
// It returns an array of possible values for slug.
// For example, [{ params: { slug: "my-first-post" } }, { params: { slug: "my-second-post" } }]
export async function generateStaticParams() {
  const files = fs.readdirSync(dirs.posts);
  const params = files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));

  return params;
}

export default function Page(props0: { params: Promise<{ slug: string }> }) {
  const data = JSON.stringify(resources())
  //console.log(dirs)
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable data={data}/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
