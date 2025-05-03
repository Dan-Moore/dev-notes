'use client'
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar"

export default function Tri() {
  const { toggleSidebar } = useSidebar();

  return( 
<Button onClick={toggleSidebar}>Toggle Sidebar</Button>
  )
}