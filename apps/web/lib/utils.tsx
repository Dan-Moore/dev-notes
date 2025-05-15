import { NavLink } from "./consts.js"

export function makeLinkLabel(nav: NavLink) {
  const Link = require("next/link")
  return (<Link 
    href={nav.slug}
    rel="noopener noreferrer"
    target="_blank"
    className="dark:text-foreground">
    {nav.label}
  </Link>)
}

export function makeLinkIcon(nav: NavLink) {
  const Link = require("next/link")
  return (<Link 
    href={nav.slug}
    rel="noopener noreferrer"
    target="_blank"
    className="dark:text-foreground">
    <nav.icon />
  </Link>)
}

export function makeButtonLink(nav: NavLink) {
  const Link = require("next/link")
  const { Button } = require("@workspace/ui/components/button")

  return (<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
    {makeLinkLabel(nav)}
    </Button>)
}