'use client'

import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <div className="relative flex w-full flex-col bg-background">
          {/*<AppHeader />*/}
          <SidebarProvider>
            <AppSidebar  />
            <main className="flex-1">
              
              <AppHeader />{children}
            </main>
          </SidebarProvider>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
