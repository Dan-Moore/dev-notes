'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { siteFonts } from "@/lib/fonts"
import { Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect, useState } from "react"

export function AppSettings() {
  const { theme, setTheme } = useTheme()
  const [selectedFont, setSelectedFont] = useState("geist")
  // const [mounted, setMounted] = useState(false) - Added within the AI code for font change.  Removing for now

  useEffect(() => {
    //setMounted(true) - Added within the AI code for font change.  Removing for now
    const currentFont = siteFonts.find((font) => font.id === selectedFont)

    if (!currentFont) return // End 

    // Remove all previous font classes
    document.documentElement.classList.forEach((className) => {
      if (siteFonts.some((font) => font.className === className)) {
        document.documentElement.classList.remove(className)
      }
    })

    // Add the new font class
    document.documentElement.classList.add(currentFont.className)

    // Update the CSS variable for the font
    document.documentElement.style.setProperty("--font-primary", currentFont.variable)
  }, [selectedFont])

  // Apply the font to the document
  const applyFont = (fontValue: string) => {
    const selectedFont = siteFonts.find((font) => font.value === fontValue)
    if (!selectedFont) return

    // Remove all font classes
    document.documentElement.classList.remove(...siteFonts.map((f) => f.value))

    // Add the selected font class
    document.documentElement.classList.add(fontValue)

    // Save preference to localStorage
    localStorage.setItem("font-preference", fontValue)
  }

  /* Added within the AI code for font change.  Removing for now
   if (!mounted) {
      return null
    }
  */

  return (
    <Sheet>
      <SheetTrigger asChild><Settings /></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            todo
          </SheetDescription>
          <Separator orientation="horizontal" />

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Theme</Label>
              <Select value={theme} onValueChange={setTheme} defaultValue="light">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark" >Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Font</Label>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {siteFonts.map((font) => (
                    <SelectItem key={font.id} value={font.id} style={{ fontFamily: `var(${font.variable})` }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
