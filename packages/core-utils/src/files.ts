import { throws } from "assert";


/**
 * Segments of path broken down by `path.parse`
 */
export type PathDetail = "root" | "dir" | "base" | "ext" | "name"

/** Node File Object */
export interface iFile {
  /** Path location made from `path.parse()` */
  path: Record<PathDetail, string>
  /** Raw file */
  blob: any
  /** Records attached to file */
  meta: Record<string, any>
}

/**
 * Makes path variable.
 * @remarks
 *  ```tsx
 * return require("path").join(root, segments);
 * ```
 * @throws TypeError if path segments are undefined
 * */
export function makePath(root: string, ...segments: string[]): string {
  return require("path").join(root, segments);
}

/**
https://nodejs.org/api/path.html#pathparsepath
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 

 * @param path 
 * @returns 
 */
export function pathParse(path: string):Record<PathDetail, string> {
    return require("path").parse(path)
}

/** 
 * Reads file with readFileSync() 
 * @throws invalid file path errors 
 */
export async function fileRead(path: string) {
  const fs = require('fs')
  if(!path || !fs.statSync(path).isFile()) {
    throw new Error(`invalid file path: ${path}`)
  }

  return fs.readFileSync(path);
}

/**
 * Generator function using node.readline
 * @param path
 */
export async function* lines(path: string) {
  const rStream = require('fs').createReadStream(path);
  const iReadline = require('readline').createInterface({
    /** The Readable stream to listen to. This option is required. */
    input: rStream,
    /**
     * If the delay between \r and \n exceeds crlfDelay milliseconds, both \r and \n will be treated as separate end-of-line input. crlfDelay will be coerced to a number no less than 100. It can be set to Infinity, in which case \r followed by \n will always be considered a single newline (which may be reasonable for reading files with \r\n line delimiter). Default: 100.
     */
    crlfDelay: Infinity,
    //completer()
    //terminal
    //history - term history
    //historySize - by line count
  });

  for await (const line of iReadline) {
    yield line;
  }
}
