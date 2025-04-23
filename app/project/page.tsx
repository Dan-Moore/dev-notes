import Image from "next/image";
import { Github, Linkedin, Rss} from "lucide-react"
import Link from "next/link";

// Menu items.
const items = [
    {
      title: "Home",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
    {
      title: "KT Corner",
      url: "#",
    },
    {
      title: "Calendar",
      url: "#",
    },
  ]
  


export default function ProjectPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <p>To save, press <kbd>Ctrl</kbd> + <kbd>S</kbd>.</p>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Hello World!
          </li>
          <li className="tracking-[-.01em]">
            todo
          </li>
        </ol>
      </main>
    </div>
  );
}
