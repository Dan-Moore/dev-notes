// todo clean up ai slop

import { Inter, Geist, Geist_Mono, Roboto, Open_Sans, Montserrat, Lora } from "next/font/google"

// Load the fonts
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
  })
  
  const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist",
  })
  
  const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
  })
  
  const openSans = Open_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-open-sans",
  })
  
  const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
  })
  
  const lora = Lora({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lora",
  })

  export const siteFonts = [
    {
      id: "inter",
      name: "Inter",
      className: inter.className,
      variable: "--font-inter",
    },
    {
      id: "geist",
      name: "Geist",
      className: geist.className,
      variable: "--font-geist",
    },
    {
      id: "roboto",
      name: "Roboto",
      className: roboto.className,
      variable: "--font-roboto",
    },
    {
      id: "open-sans",
      name: "Open Sans",
      className: openSans.className,
      variable: "--font-open-sans",
    },
    {
      id: "montserrat",
      name: "Montserrat",
      className: montserrat.className,
      variable: "--font-montserrat",
    },
    {
      id: "lora",
      name: "Lora",
      className: lora.className,
      variable: "--font-lora",
    },
  ]
  
  
  export { inter, geist, roboto, openSans, montserrat, lora }