"use client";

import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { site } from "@/lib/consts";
import { makeNavButton, makeNavLink } from "@/lib/utils";

export function DefaultHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-4 lg:px-6 ">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <TooltipProvider>
          {site.pages.primary.map((page, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>{makeNavLink(page)}</TooltipTrigger>
              <TooltipContent>
                <p>{page.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        <div className="ml-auto flex items-center gap-2">
          {makeNavButton(site.pages.static.about)}
        </div>
      </div>
    </header>
  );
}
