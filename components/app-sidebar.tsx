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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

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

  

export function AppSidebar() {

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
                    <a href={footer.url}>
                      <footer.icon />
                      <span>{footer.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  )
}
