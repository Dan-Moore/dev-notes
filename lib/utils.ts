import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MarkdownDirectory } from "./io";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns any stored MarkdownFiles found when traversing over MarkdownDirectory[].
 * @param dirs
 * @remarks
 * Map-reduce on MarkdownDirectory[]
 * @returns MarkdownFile[]
 */
export function fetchFiles(dirs: MarkdownDirectory[] | []) {
  return dirs
    .map((dir: MarkdownDirectory) => dir.files)
    .reduce((x, y) => [...x, ...y]);
}