"use client"

import {
  IconDotsVertical,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Github, Linkedin, Rss } from "lucide-react"
import { Tooltip, TooltipProvider } from "./ui/tooltip"
import Link from "next/link"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <TooltipProvider>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-8 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
            <Tooltip>
              <Link href={process.env.NEXT_PUBLIC_PROFILE_GITHUB || '/'}>
              <DropdownMenuItem>
                <Github />
                Github
              </DropdownMenuItem>
              </Link>
              </Tooltip>
              <Link href={process.env.NEXT_PUBLIC_PROFILE_GITHUB || '/'}>
              <DropdownMenuItem>
                <Linkedin />
                LinkedIn
              </DropdownMenuItem>
              </Link>
              <Link href={process.env.NEXT_PUBLIC_PROFILE_GITHUB || '/'}>
              <DropdownMenuItem>
                <Rss />
                Notifications
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
          </TooltipProvider>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/*
<TooltipProvider>
          {page_links.map((page, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild >
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link 
              href={page.url}
              title={page.title}
              >
              <page.icon />
            </Link>
            </Button>
            </TooltipTrigger>
            <TooltipContent>
          <p>{page.title}</p>
        </TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
*/