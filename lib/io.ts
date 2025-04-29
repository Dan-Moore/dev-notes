import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const FilterDateRule = { ON: 'on', BEFORE: 'pre', AFTER: 'post' }


/**
 * Reads directory with fs.readdirSync() & io.parse()
 * @remarks
 * {
 *  name: file name
 *  dir: path to file
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
 * @param dir - directory path to the file
 * @param name - name of the file
 * @returns 
 */
export function parse(dir: string, name: string) {
    const _path = path.join(dir, name) // _path = ("public/markdown/calendar", "hi.mdx")
    if (fs.existsSync(_path)) {
        const fs_content = fs.readFileSync("" + _path);
        const { data: front_matter, content } = matter(fs_content);
        return {
            dir: dir,
            name: name,
            path: _path,
            meta: front_matter,
            content: content
        };
    }
    return { dir: '', name: '', path: '', meta: {}, content: '' };
}

export function slug(file_name: any) {
    return file_name.slice(0, file_name.lastIndexOf('.')) || file_name
}


export function details(file: {
    dir: string;
    name: string;
    path: string;
    meta: {
        [key: string]: any;
    };
    content: string;
}) {
    if (!file || file == undefined || file == null ||
        !file.meta || file.meta == undefined || file.meta == null || file.meta.length == 0) {
        return undefined
    }

    let meta_dates = (file.meta["date"].constructor !== Array) ? 
    [new Date(file.meta["date"].toString()) ] 
    : 
    file.meta["date"].map( (date: string) => new Date(date) )
    
    return {
        dates: meta_dates,
        title: file.meta?.["title"],
        description: file.meta?.["description"],
        tags: file.meta?.["tags"],
        author: (file.meta?.["author"] ? file.meta?.["author"] : process.env.AUTHOR )
    }
}


export function posts() {
    let files = walk(process.env.DIR_MD_POSTS)
    /*
        let rules = {
            'tags': ['hi', 'nextjs'],
            'dates': [{
                'date': new Date(),
                'op': FilterDateRule.AFTER
            }]
        };
    
        let bar = filterFiles(files, rules)
        console.log(bar)
        */
    return files;
}


/**
 * Filter function - todo
 * @param files 
 * @param rules 
 * @returns 
 */
function remove(
    files: { dir: string; name: string; path: string; meta: { [key: string]: any; }; content: string; }[],
    rules: { tags: string[]; dates: { date: Date; op: string; }[]; }) {
    // Null check - returning as-is if rules are missing 
    if (!rules || rules == undefined || rules == null) {
        return files;
    } else if (
        (!rules.dates || rules.dates == undefined || rules.dates == null || rules.dates.length == 0)
        &&
        (!rules.tags || rules.tags == undefined || rules.tags == null || rules.tags.length == 0)) {
        return files;
    }

    // helper functions
    const date_validator = function (rule: string, rule_date: Date, meta_date: Date) {
        console.log(meta_date.toDateString() + ` [${rule}] ` + rule_date.toDateString())

        if (rule == FilterDateRule.ON) {
            return rule_date == meta_date
        } else if (rule == FilterDateRule.BEFORE) {
            return rule_date < meta_date
        } else if (rule == FilterDateRule.AFTER) {
            return rule_date > meta_date
        }
        return false;
    }


    // running the filter ...
    return files.filter((file) => {
        // Checking Required Tags;
        let isValidTag = false;
        rules.tags.forEach((tag_rule) => {
            const meta_tags: string[] = file.meta['tags']
            isValidTag = meta_tags.includes(tag_rule);
        })


        // Checking Date Requirements
        // in meta, dates can be 'string' or 'string[]' 
        let isValidDate = false;
        rules.dates.forEach((date_rule) => {
            const meta_date = file.meta['date']
            if (meta_date.constructor === String) {
                isValidDate = date_validator(date_rule.op, date_rule.date, new Date(meta_date.toString()))
                return isValidDate
            } else if (meta_date.constructor === Array) {
                // checking date range
                meta_date.forEach((date) => {
                    if (!isValidDate) {
                        isValidDate = date_validator(date_rule.op, date_rule.date, new Date(meta_date.toString()))
                        return isValidDate;
                    }
                })
            }
        })
        //console.log(`[isValidTag:${isValidTag}, isValidDate:${isValidDate}]`)
        return isValidTag && isValidDate;
    })
}