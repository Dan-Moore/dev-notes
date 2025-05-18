import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState, type ReactNode } from "react";
import { Label } from "../ui/label";

interface iProps {
  children: ReactNode;
}

/** Wrapper around shadcn's content menu. */
export function PageMenu({ children }: iProps) {
  const [isDark, setDarkMode] = useState(true);
  const flexFull = "flex min-h-screen w-full";
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={isDark ? `${flexFull} dark` : `${flexFull} light`}>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>{DarkModeSwitch()}</ContextMenuItem>
        <ContextMenuItem>Themes</ContextMenuItem>
        <ContextMenuItem>Fonts</ContextMenuItem>
        <ContextMenuItem>Save as</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// todo - figure out how to change label text.  not sticking atm
//        sandbox atm, refresh is called on page load App.tsx
export const refresh = (isDark: boolean) => {
  if (isDark) {
    document.body.classList.toggle("dark");
    if (document.getElementById("lblDarkMode")) {
      document.getElementById("lblDarkMode").innerText = "Dark Mode";
    }
  } else {
    document.body.classList.toggle("light");
    if (document.getElementById("lblDarkMode")) {
      document.getElementById("lblDarkMode").innerText = "Light Mode";
    }
  }
};

function DarkModeSwitch() {
  const [isDark, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    if (isDark) {
      refresh(isDark);
      setDarkMode(true);
    } else {
      refresh(isDark);
      setDarkMode(false);
    }
  };

  if (isDark) {
    return (
      <>
        <Label
          id="lblDarkMode"
          onClick={toggleDarkMode}
          className="flex w-full"
        >
          Light Mode
        </Label>
      </>
    );
  } else {
    return (
      <>
        <Label
          id="lblDarkMode"
          onClick={toggleDarkMode}
          className="flex w-full"
        >
          Dark Mode
        </Label>
      </>
    );
  }
}
