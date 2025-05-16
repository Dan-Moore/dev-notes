"use client"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@workspace/ui/components/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Tooltip, TooltipProvider } from "@workspace/ui/components/tooltip"
import Link from "next/link"
import { Github, Linkedin, Rss } from "lucide-react"
import { IconDotsVertical } from "@tabler/icons-react"
import { dev } from "@/lib/consts"

export function NavDev() {
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
                <AvatarImage src={dev.avatar} alt={dev.name} />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{dev.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {dev.email}
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
                  <span className="truncate font-medium">{dev.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {dev.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
            <Tooltip>
              <Link href={dev.github}>
              <DropdownMenuItem>
                <Github />
                Github
              </DropdownMenuItem>
              </Link>
              </Tooltip>
              <Link href={dev.linkedin}>
              <DropdownMenuItem>
                <Linkedin />
                LinkedIn
              </DropdownMenuItem>
              </Link>
              <Link href={dev.rss}>
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