import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {page_links } from "@/lib/consts"



export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-4 lg:px-6 " >
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
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
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link 
              href={process.env.NEXT_PUBLIC_REPO || 'todo'}
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground">
              About
            </Link>
          </Button>
          
        </div>
      </div>
    </header>
  )
}

/*
Need to clean this up
*/
export function SiteHeaderClosedDashboard() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-4 lg:px-6 " >
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
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link 
              href={process.env.NEXT_PUBLIC_REPO || 'todo'}
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground">
              About
            </Link>
          </Button>
          
        </div>
      </div>
    </header>
  )
}