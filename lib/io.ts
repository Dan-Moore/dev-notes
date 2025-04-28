import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Reads directory with fs.readdirSync(). 
 * @remarks
 * {
 *  name: file name
 *  pwd: path to file
 *  meta: front matter headers
 *  content: file content
 * }
 * 
 * @param dir_path 
 * @returns 
 */
export function walk(dir_path: string) {
    const fs_files = fs.readdirSync(dir_path);

    const files = fs_files.map((fs_file) => {
        return parse(dir_path, fs_file)
    })
    return files;
}

/**
 * Parses the file with gray-matter
 * @example 
 * ```ts
 * const fs_content = fs.readFileSync("" + _path);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param pwd - directory path to the file
 * @param name - name of the file
 * @returns 
 */
export function parse(pwd: string, name: string) {
    const _path = path.join(pwd , name) // _path = ("public/markdown/calendar", "hi.mdx")
    if(fs.existsSync(_path)){
        const fs_content = fs.readFileSync("" + _path);
        const { data: frontMatter, content } = matter(fs_content);
        return {
            pwd: pwd,
            name: name,
            path: _path,
            meta: frontMatter,
            content: content
        };
    }
    return {pwd: '', name: '', path: '', meta: '', content: ''};
}

export function getEvents() {
    const _files = walk(process.env.DIR_CALENDAR)
    let _events = _files.map((_file) => {
      let _event = parse(process.env.DIR_CALENDAR, _file.name)
      return _event
    })

    console.log(_events)
    return _events;
}