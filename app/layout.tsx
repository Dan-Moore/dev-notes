import type { Metadata } from "next";
import { Geist, Geist_Mono} from "next/font/google"

import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Dev Notes",
  description: "todo",
};


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
          <AppHeader />
          <main className="flex-1">{children}</main>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
