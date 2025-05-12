import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { components } from "@/components/mdx"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppResources, MarkdownFile, DevNote } from "@/lib/nightly/consts"
import { find } from "@/lib/nightly/io"
import { makeNote } from "@/lib/nightly/utils"
import { MDXRemote } from "next-mdx-remote/rsc"



export default async function Page({ params }: { params: { slug: string[] } }) {
    const slug = decodeURI(params.slug.join('/'))    
    const file = await find(AppResources["online-resources"], slug)
    const note = makeNote(file)    

  return (
    <SidebarProvider defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            <MDXRemote source={note.markdown.content} components={components} />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


