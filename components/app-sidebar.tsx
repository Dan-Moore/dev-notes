'use client'

import { BookMarked, Calendar, Home, Inbox, Newspaper, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import path from "path";


  import { usePathname } from 'next/navigation'
import { fetchMDX } from "@/lib/io"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Blog",
    url: "#",
    icon: Newspaper,
  },
  {
    title: "KT Corner",
    url: "#",
    icon: BookMarked,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
]

const footer =   {
    title: "Foo",
    url: "#",
    icon: Calendar,
  }

  export async function generateStaticParams() {
    const pathname = usePathname()
    console.log(pathname)
   
    const filePath = path.join(process.env.KT_CORNER_DIR + "/" + pathname , 0 + ".mdx");
   // const mdx = fetchMDX(filePath);
  
    return { props: { mdx: 'filePath' } }
  }



export function AppSidebar({ params }) {
  
  // todo: parse dir to build side bar links.  See if I can build them from # tags in mdx or hard-coded in mdx headers

  console.log("Here")
  console.log(params)

  return (
    
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dev Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem key={footer.title}>
                  <SidebarMenuButton asChild>
                  <p><kbd>Ctrl</kbd> + <kbd>B</kbd></p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  )
}
