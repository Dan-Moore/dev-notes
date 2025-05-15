

/**
 * Makes path variable.
 * @remarks
 *  ```tsx
 * return require("path").join(root, segments);
 * ```
 * @throws TypeError if path segments
 * */
export function makePath(root: string, ...segments: string[]): string {
  return require("path").join(root, segments);
}

/**
 * Segments of path.
 */
export type PathDetail = "root" | "dir" | "base" | "ext" | "name"

/**

// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 

 * @param path 
 * @returns 
 */
export function pathDetails(path: string):Record<PathDetail, string> {
    return require("path").parse(path)
}

