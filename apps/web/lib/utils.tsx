import { iNavLink } from "./consts.js";


/**
 * Builds Next/Link component
 * @remarks
 * https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
 * @param nav - Navigation Link: {slug="#settings", label="Settings", icon=require("lucide-react").Settings}
 * @param showIcon - default true. Display the icon, instead of the label.
 */
export function makeNavLink<T extends iNavLink>(nav: T, showIcon = true) {
  const Link = require("next/link");
  if (showIcon) {
   // const casted = nav as unknown as iNavIcon;
    return (
      <Link
        href={nav.slug}
        rel="noopener noreferrer"
        target="_blank"
        className="dark:text-foreground"
      >
        <nav.icon />
      </Link>
    );
  } else {
    return (
      <Link
        href={nav.slug}
        rel="noopener noreferrer"
        target="_blank"
        className="dark:text-foreground"
      >
        {nav.label}
      </Link>
    );
  }
}

/**
 * Builds a navigation shadcn button.
 * @param nav - Navigation Link: {slug="/", label="Home"}
 */
export function makeNavButton<T extends iNavLink>(nav: T) {
  const { Button } = require("@workspace/ui/components/button");
  return (
    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
      {makeNavLink(nav, false)}
    </Button>
  );
}
