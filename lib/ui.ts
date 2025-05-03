import { Inter, Geist, Geist_Mono, Roboto, Open_Sans, Montserrat, Lora } from "next/font/google"

export const themes = [
    { id: "light", name: "Light" },
    { id: "dark", name: "Dark" },
];

// Fonts 
export const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
  })
  
export const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist",
  })
  
 export const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
  })
  
export const openSans = Open_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-open-sans",
  })
  
  export const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
  })
  
  export const lora = Lora({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lora",
  })

  export const fonts = [
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
// End of Fonts
  
