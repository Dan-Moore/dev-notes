import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "./data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { AppResources } from "@/lib/nightly/consts"
import { all } from "@/lib/nightly/io"


export async function generateStaticParams() {
  const files = await all(AppResources.posts);
  
  // building slugs for params
  const params = files.map((file) => ({
    // removing file path to make slug
    slug: file.name.replace(".mdx", ""),
  }));

  return params;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const files = await all(AppResources["online-resources"])
  
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
              <DataTable files={files}/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
