# Hello World
This website was built using [Next.js](https://nextjs.org/docs) and design with [shadcn](https://ui.shadcn.com/).  

Markdown files are compressed and stored within a SQLite database before rendering with [MDX](https://nextjs.org/docs/app/guides/mdx) to build web components.


![react](/public/images/react-native.svg) ![markdown](/public/images/markdown.svg) ![sqlite](/public/images/sqlite.svg)

## NPM Cheat Sheet
Following are some basic npm commands and their usage.
- `npm install` - Downloads and install npm packages.  Review [package.json](/package.json)
- `npm update` - Updates npm packages
- `npm run dev` - Runs a local instance at [http://localhost:3333](http://localhost:3333) or next available port #
- `npm run build` - Runs the build script. Will archive markdown pages ready for publication.

## Markdown
Most pages will be written in markdown. A [root](/public/markdown/) directory houses folders used by [App Router](https://nextjs.org/docs/app/building-your-application/routing).

To render a markdown page, [MDXRemote](https://nextjs.org/docs/app/guides/mdx#remote-mdx) is used to load in the page content.
```tsx
<div className="flex-1 p-6">
  <MDXRemote source={file.content} components={components} />
</div>
```
Files can also be directly imported as components.
```tsx
import WebPage from "./nixos.mdx"
export default function Page() {
  return (<><WebPage /></>)
}
```

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
export function walk(dir: string, files: MarkdownFile[] = []) {
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
function parse(p: string) {
  const { data: headers, content } = matter(fs.readFileSync(p));

  // Wrapping meta around JSON.parse to match
  // file type of MarkdownFiles read in from db.
  return make(
    path.dirname(p),
    path.basename(p),
    content,
    JSON.parse(JSON.stringify(headers)),
    true
  );
}
```

## SQLite
todo
