import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MarkdownFile {
  readonly dir: string
  readonly name: string 
  readonly link: string 
  readonly content: string
  /**
   * @remarks
   * all front-matter headers. For common re-useable fields, add them to details.
   */
  readonly meta: { [key: string]: any } | {}
  readonly details: {
    dates: Date[] | []
    title: string
    desc: string
    tags: string[] | []
    author: string | undefined
    publish: Date | undefined
    /**
     * @returns returns true if 'draft' was found in headers or before publish date.
     */
    draft: boolean | true
  };
  /**
   * fetches H# headers from the markdown file.
   * @remarks
   * Sample:
   * [{level:0, raw:'# Hello World', label:'Hello World', link: '#hello-world'}]
   * @returns 
   */
  headers: () => [
    {
      level: number
      raw: string
      label: string
      link: string
    }
  ];
}

export interface MarkdownDirectory {
  readonly title: string;
  readonly dates: Date[];
  readonly banner: MarkdownFile;
  readonly files: MarkdownFile[];
}


/**
 * Parses the file path with gray-matter.
 * @example
 * ```ts
 * const fs_content = fs.readFileSync("" + p);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param p path variable - public/markdown/hi.mdx
 * @returns
 */
export function parse(p: string) {
  // console.log(`running parse(${p})`);
  const isReal = fs.existsSync(p);
  if (isReal && fs.statSync(p).isDirectory()) {
    throw new Error(`unable to parse(${p}).  Given path was a directory!`);
  } else if (!isReal || !fs.statSync(p).isFile()) {
    throw new Error(
      `unable to parse(${p}).  Unknown object failed either fs.existsSync(${p}) or fs.statSync(${p}).isFile().`
    );
  }

  // parsing with gray-matter
  const fs_buffer = fs.readFileSync("" + p);
  const { data: meta, content } = matter(fs_buffer);

  // pulling out any fields called date or dates
  // both fields will be combine into one set.
  // too messy atm to added as a one liner in the return.
  function getDates(meta: { [key: string]: any }): Date[] {
    // todo - clean up
    let dates: Date[] = [];
    if (!meta["date"] && !meta["dates"]) {
      return dates;
    }
    if (meta["date"]) {
      if (meta["date"].constructor !== Array) {
        dates.push(new Date(meta["date"].toString()));
      } else {
        dates = [
          ...dates,
          ...meta["date"].map((date: string) => new Date(date)),
        ];
      }
    }
    if (meta["dates"]) {
        if (meta["dates"].constructor !== Array) {
          dates.push(new Date(meta["dates"].toString()));
        } else {
          dates = [
            ...dates,
            ...meta["dates"].map((date: string) => new Date(date)),
          ];
        }
      }

    return dates;
  }

  // building file object.
  return {
    dir: path.dirname(p),
    name: path.basename(p),
    meta: meta,
    content: content,
    link: p.replace(process.env.MD_DIR, '').replace('.mdx', ''),
    details: {
      dates: getDates(meta),
      title: meta["title"],
      desc: meta["desc"] ? meta["desc"] : meta["description"],
      tags: meta["tags"],
      author: meta["author"] ? meta["author"] : process.env.AUTHOR,
      publish: meta["publish"] ? new Date(meta["publish"]) : undefined,
      draft: meta["draft"]
        ? meta["draft"]
        : meta["publish"]
        ? new Date() < new Date(meta["publish"])
        : true,
    },
    headers: () => {
      // todo - pull out markdown headers
      return [
        {
          level: 0,
          raw: "string",
          label: "string",
          link: "string",
        },
      ];
    },
  };
}

/**
 * Reads directory with fs.readdirSync() & io.parse().
 * @remarks
 * Doesn't walk through nested folders in a directory,
 * but only grabs the files at the given root directory.
 *
 * @param dir - directory
 * @returns
 */
export function read_dir(dir: string) {
  const files: MarkdownFile[] = [];
  fs.readdirSync(dir).map((fs_file) => {
    files.push(parse(path.join(dir, fs_file)));
  });
  return files;
}

/**
 * Recursive directory walk.
 * @param dir - /public/markdown/calendar
 * @param files - optional []. List of found files in the dir
 * @returns
 */
export function walk(dir: string, files: MarkdownFile[] = []) {
  if (!dir || dir == undefined || dir == null || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }
  //console.log(`running walk(${dir})`)
  if (fs.statSync(dir).isDirectory()) {
    for (const p of fs.readdirSync(dir).map((name) => path.join(dir, name))) {
      walk(p, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    files.push(parse(dir));
  }

  return files;
}


export function posts() {
  // reading only root files in the blog directory.
  return read_dir(`${process.env.MD_DIR}/posts`);
}

export function resources() {
  const files = walk(`${process.env.MD_DIR}/learning`);

  // fetching all banner files.
  const banners = files.filter((file) => {
    //console.log(`checking name: ${file.name} - ${file.name?.startsWith("banner.md")}`)
    return file.name?.startsWith("banner.md");
  });
  //console.log(`banners: \n${JSON.stringify(banners)}`);

  // building 
  const dirs: MarkdownDirectory[] = [
    ...banners.map((banner) => {
      const event: MarkdownDirectory = {
        title: banner.details.title,
        dates: banner.details.dates ? banner.details.dates : [new Date()],
        banner: banner,
        //grabbing all files in the same banner directory.
        files: files.filter((file) => {
            //console.log(`checking ${file.dir} == ${banner.dir} on ${file.name}`)
            //console.log(file.dir == banner.dir && !file.name?.startsWith("banner.md"))
          return file.dir == banner.dir && !file.name?.startsWith("banner.md");
        }),
      };
      return event;
    }),
  ];

  
  return dirs;
}
