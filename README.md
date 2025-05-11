# Hello World
This website was built using [Next.js](https://nextjs.org/docs) and design with [shadcn](https://ui.shadcn.com/).  

Markdown files are compressed and stored within a SQLite database before rendering with [MDX](https://nextjs.org/docs/app/guides/mdx) to build web components.

### [Wiki](https://github.com/Dan-Moore/dev-notes/wiki)
The Development guides on work with `dev-notes`  

### [Project Board](https://github.com/users/Dan-Moore/projects/2/views/2)
I've setup a project page to keep track of content updates and development tasks.


---

> todo: put the following somehwere in the wiki

### Schema
`MarkdownFile` is an object I'm using to store parsed data from a Markdown file with `/public/markdown`
The file contains the source text compressed and has a `raw()` function built-in to uncompress the file for MDX Remote.

See [io.ts](/lib/io.ts) for latest implementation.
```tsx
export interface MarkdownFile {
  dir: string;                         // Path of the Directory 
  name: string;                        // Name of the file
  content: string;                     // File contents, compressed with zlib
  meta: { [key: string]: any } | {};   // Front-Matter header dictionary  
  details: {                           // Contains usable fields for app components
    link: string;                      // Link to the webpage
    title: string;                     // Title of the document
    desc: string;                      // Description of the document
    tags: string[];                    // Related subject tags of the document
    publish?: Date;                    // Date of publication - nullable 
    modified: Date;                    // Date of last mod - defaults to current
  };
  raw: () => string;                   // Function to uncompress the markdown doc
                                       // Function to return H# sections
  headers:() => {level: number, raw: string, label: string, link: string}
}
```

### Directory Dumps & Walks
The `fs.readdirSync(dir)` is used in a recursive directory walk to build a collection of `MarkdownFile` objects.

```tsx
function walk(dir: string, files: MarkdownFile[] = []) {
  if (!dir || !fs.existsSync(dir)) {
    throw new Error(`unable to walk(${dir}, ${files})!  Invalid directory!`);
  }

  print(`running walk(${dir})`);
  if (fs.statSync(dir).isDirectory()) {
    // p - path variable to re-run the walk command on.
    for (const p of fs.readdirSync(dir).map((name) => path.join(dir, name))) {
      walk(p, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    const file = parse(dir);
    print(`found ${file.name}`);
    files.push(file);
  }

  return files;
}
```

### Parsing Markdown Docs

A file read operation is done with [`fs.readFileSync(p)`](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) and [`matter`](https://github.com/jonschlinkert/gray-matter) is used to strip out the front-matter headers from the markdown document.

`make` is a helper function that creates `MarkdownFile` objects.  See [io.ts](/lib/io.ts) for usage.
```tsx
/**
 * Parses local markdown file with gray-matter.
 * @remarks
 * ```
 * const fs_content = fs.readFileSync(p);
 * const { data: frontMatter, content } = matter(fs_content);
 * ```
 * @param p - path variable: 'public/markdown/hi.mdx'
 *
function parse(p: string) {
  const { data: headers, content } = matter(fs.readFileSync(p));
  // JSON.parse here is redundant. 
  // Forcing data type to match with a MarkdownFile
  // retrieved from the database. 
  return make(
    path.dirname(p),
    path.basename(p),
    content,
    JSON.parse(JSON.stringify(headers)),
    true
  );
```

## SQLite
todo
