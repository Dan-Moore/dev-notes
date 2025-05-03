import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { fonts, themes } from "@/lib/ui";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  props.collapsible = "icon";

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border"></SidebarHeader>
      <SidebarContent>
        <SidebarSettings />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function SidebarSettings() {
    const { theme, setTheme } = useTheme();

    const buildThemeSelection = function () {
      return (
        <>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <span>Themes</span>
            </SidebarMenuSubButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                  >
                    <span>{theme.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuSubItem>
        </>
      );
    };
    const buildFontSelection = function () {
      const [selectedFont, setSelectedFont] = useState("inter");
      useEffect(() => {
        const currentFont = fonts.find((font) => font.id === selectedFont);
        if (!currentFont) return;
  
        // Remove all previous font classes
        document.documentElement.classList.forEach((className) => {
          if (fonts.some((font) => font.className === className)) {
            document.documentElement.classList.remove(className);
          }
        });
  
        // Add the new font class
        document.documentElement.classList.add(currentFont.className);
  
        // Update the CSS variable for the font
        document.documentElement.style.setProperty(
          "--font-primary",
          currentFont.variable
        );
      }, [selectedFont]);
      return (
        <>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <span>Fonts</span>
            </SidebarMenuSubButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                {fonts.map((font) => (
                  <DropdownMenuItem
                    key={font.id}
                    onClick={() => setSelectedFont(font.id)}
                  >
                    <span>{font.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuSubItem>
        </>
      );
    };
  return (
    <>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">

        <Collapsible
        key="settings"
        title="settings"
        defaultOpen
        className="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel
            asChild
            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <CollapsibleTrigger>{" Settings "}</CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSub>
                    {buildThemeSelection()}
                    {buildFontSelection()}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

        </Collapsible>
      </SidebarMenu>
    </>
  );
}