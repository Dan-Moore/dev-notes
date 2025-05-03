import * as React from "react";
import { Github, Linkedin, MoreHorizontal, Rss } from "lucide-react";
import { fonts, themes } from "@/lib/ui";
import { Label } from "./ui/label";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Collapsible } from "./ui/collapsible";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();
  props.collapsible = "icon";

  let { theme, setTheme } = useTheme();

  function themeLight() {
    theme = "light";
    setTheme(theme);
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border"></SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />

        <BuildSettings />
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

export function BuildSettings() {
  return (
    <>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          {/** Theme Selection */}

          <SidebarSettingsMenuItem />
          {/**
            <SidebarMenuButton asChild>
              <span>Themes</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                <BuildThemeSelection />
              </DropdownMenuContent>
            </DropdownMenu>
            */}

          {/** Font Selection 
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span>Fonts</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                <BuildFontSelection />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          */}
        </Collapsible>
      </SidebarMenu>
    </>
  );
}

/*
            <SidebarMenuButton asChild>
              <span>Themes</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                <BuildThemeSelection />
              </DropdownMenuContent>
            </DropdownMenu>
*/

export function SidebarSettingsMenuItem() {
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
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span>Settings</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
          {buildThemeSelection()}
          {buildFontSelection()}
          </SidebarMenuSub>
          
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}


/*
 * Old Code! see SidebarSettingsMenuItem
 */

export function BuildThemeSelection() {
  let { theme, setTheme } = useTheme();
  return (
    <>
      {themes.map((theme) => (
        <DropdownMenuItem key={theme.id} onClick={() => setTheme(theme.id)}>
          <span>{theme.name}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function BuildFontSelection() {
  // defaulting to inter
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

  // Apply the font to the document
  const applyFont = (fontValue: string) => {
    const selectedFont = fonts.find((font) => font.value === fontValue);
    if (!selectedFont) return;

    // Remove all font classes
    document.documentElement.classList.remove(
      ...fonts.map((font) => font.value)
    );

    // Add the selected font class
    document.documentElement.classList.add(fontValue);

    // Save preference to localStorage
    localStorage.setItem("font-preference", fontValue);
  };
  return (
    <>
      {fonts.map((font) => (
        <SidebarMenuSubItem
          key={font.id}
          onClick={() => setSelectedFont(font.id)}
        >
          <span>{font.name}</span>
        </SidebarMenuSubItem>
      ))}
    </>
  );
}
