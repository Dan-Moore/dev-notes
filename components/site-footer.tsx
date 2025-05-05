import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import Link from "next/link";
import {page_links } from "@/lib/consts"

/*
      <div className="">

*/

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-6 md:py-0 sticky bottom-1 ">
      <div className="grid grid-cols-4 gap-4 ">
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
      </div>
    </footer>
  )
}