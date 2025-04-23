import { BookMarked, Calendar, Home, Inbox, Newspaper, Search, Settings, Sprout } from "lucide-react"

import Link from "next/link"
import { AppSearch } from "./app-search"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Newspaper,
  },
  {
    title: "KT Corner",
    url: "/kt-corner",
    icon: BookMarked,
  },
  {
    title: "Projects",
    url: "/project",
    icon: Sprout,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
]
  
export function AppHeader() {
  return (
    <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6 px-8">
              {items.map((item, index) => (
                <Link key={index} 
                href={item.url} 
                title={item.title}
                className="mr-8 flex items-center space-x-2">
                    <item.icon />
                </Link>
              ))}
              </nav>
              <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center px-8">
              <AppSearch/>
              </nav></div>
    </div>

</header>
  )
}
