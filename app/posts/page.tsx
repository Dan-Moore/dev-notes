

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getPosts } from "@/lib/io";
import Link from "next/link";

export default function Page() {
  const posts = getPosts()
  console.log(posts)
  
/*
          <article key={'post.link'} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={'post.link'} className="block space-y-3">
              <h2 className="text-2xl font-bold">{'post?.details?.title'}</h2>
              {'post?.details?.desc && <p className="text-muted-foreground">{post?.details?.desc}</p>'}
              <div className="flex gap-2 pt-2">
                {(post.details.tags) ? post.details.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {tag}
                  </span>
                )): <></>}
              </div>
            </Link>
          </article>
*/

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
      {posts.map((post) => (
          <article key={post.details.link} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={post.details.link} className="block space-y-3">
            <h2 className="text-2xl font-bold">{post?.details?.title}</h2>
            {post?.details?.desc && <p className="text-muted-foreground">{post?.details?.desc}</p>}
              <div className="flex gap-2 pt-2">
              {(post.details.tags) ? post.details.tags.map((tag: string) => (
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