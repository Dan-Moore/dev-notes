"use client"

import * as React from "react"
import type { KeyboardEvent } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Keyboard, Search } from "lucide-react"
import { Input } from "./ui/input"
import Link from "next/link"

export function AppSearch() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent | any) => {
      // Skip if the user is typing in an input, textarea, or other form element
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable) {
        return
      }

      // Check if the pressed key is 'g'
      if (event.key === "g") {
        event.preventDefault()
        setOpen(true)
      }
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown)

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
        <Link href="" title="Search"><Search /></Link>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>
            todo description
          </SheetDescription>
        </SheetHeader>
        <div className="flow-root">
            <Input className="float-left" placeholder="Search ..." />
        </div>
    
      </SheetContent>
    </Sheet>
  )
}
