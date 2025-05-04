import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MarkdownDirectory } from "./io";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Map-reduce on MarkdownDirectory[]
 * @param dirs
 * @returns
 */
export function fetchFiles(dirs: MarkdownDirectory[] | []) {
  return dirs
    .map((dir: MarkdownDirectory) => {
      return dir.files;
    })
    .reduce((x, y) => {
      return [...x, ...y];
    });
}
