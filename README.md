# Hello World!
This website was build with [Next.js](https://nextjs.org/docs) and [shadcn](https://ui.shadcn.com/).

## NPM Cheat Sheet
- `npm install` - Downloads and install npm packages. 
- `npm update` - Updates npm packages
- `npm run dev` - Runs a local instance on port [3333](http://localhost:3333)

### Changing Localhost Port 
The `-p` flag is used to indicate to port number during the run script. 
Edit [package.json](/package.json) to change the port number.
By default Node picks `3000`. If its already in use, then Node will start incrementing the port number till it finds the next available port.
```json
  "scripts": {
    "dev": "next dev --turbopack -p 3333",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
```
## Markdown
Most pages will be written in markdown. A [root directory](/public/markdown/) houses folders used by [App Router](https://nextjs.org/docs/app/building-your-application/routing). 


Re-useable environment variables have been added to [.env](/.env) 
Sample use case: `process.env.MD_DIR`

To render a markdown page.  [MDXRemote](https://nextjs.org/docs/app/guides/mdx) is used to load in the page content.
```typescript
<div className="flex-1 p-6">
  <MDXRemote source={event.banner.content} components={components} />
</div>
```

### Parsing Markdown Docs
See [io.ts](/lib/io.ts) for current implementation.  
[Gray-matter](https://github.com/jonschlinkert/gray-matter) is used for parsing out front-matter headers from the MDX files.

```tsx
  const fs_buffer = fs.readFileSync(p);
  const { data: meta, content } = matter(fs_buffer);
```

A recursive directory walk is used within the walk command. 
Produces a collection [MarkdownFile](#markdownfile-schema) objects for any file found during the walk. 

Sample use case `walk(/public/markdown/events)`
```tsx
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

  if (fs.statSync(dir).isDirectory()) {
    for (const p of fs.readdirSync(dir).map((name) => path.join(dir, name))) {
      walk(p, files);
    }
  } else if (fs.statSync(dir).isFile()) {
    files.push(parse(dir));
  }

  return files;
}
```


#### MDX Remote
[MDX Remote](https://nextjs.org/docs/app/guides/mdx) is render in MDX files into the Nextjs client.


```tsx
import DevNotes from './dev-notes.mdx'

interface PageProps {
  params: {
    slug: string[]
  }
}

async function getPageFromParams(params: PageProps["params"]) {
  const slug = await params?.slug?.join("/")
  let foundFile = undefined
  for(const event of events()) {
    foundFile = event.files.find(
      (file) => (file.link.trim().match((`${process.env.EVENT_DIR}/${slug}`).trim())))
  }
  return foundFile;
}


export default async function PagePage({ params }: PageProps) {
  const markdown = await getPageFromParams(params)
  if (!markdown) {
    notFound()
  }

  return (
    {/* Using MDX file as a component */}
    <DevNotes />

    <article className="py-10 prose dark:prose-invert ">
      {/* Using MDX file from a remote source. i.e. /public/markdown */}
      <MDXRemote source={markdown.content} components={components} />
    </article>
  )
}
```


#### MarkdownFile Schema
| Field | Type | Description | Sample |
| --- | --- | --- | --- | 
| dir | string | Directory of the file | /public/markdown/events/pycon-2025
| name | string | Name of the file | banner.mdx
| link | string | Link to the file | /events/pycon-2025/banner.mdx
| content | string | File content parsed with `gray-matter` | 
| meta | {[key: string]: any;} | Front-matter headers | [{title: 'Sample Post'}, {date: '2025-05-01'}]
| details | {} | File information object | See Details schema
| headers | () => [{},{}] | Markdown Headers | [{level: 1, raw: '# Hello World!', label: 'Hello World!', link: 'hello-world'}]

#### MarkdownFile.Details Schema
| Field | Type | Description | Sample |
| --- | --- | --- | --- | 
| dates | Date[] | Collection of 'date' and 'dates' keys | 
| title | string | Value of front-matter header 'title' | Hello World
| desc | string |Value of front-matter header 'desc' & 'description | Sample blog post
| tags | string | Collection of tags about the file | [java, spring]
| author | string | Defaults to environment variable if not set in header | Dan
| publish | Date | Date when the file should be viewable | 
| draft | boolean | flag if the file is draft mode. File contents won't be viewable regardless of publish date | True

#### Event Schema
| Field | Type | Description | Sample |
| --- | --- | --- | --- | 
| title | string | Name of the event | PyCon 2025
| dates | Date[] | Date range of the event | 
| about | MarkdownFile | information file about the event | about.mdx
| files | MarkdownFile[] | files found in the event directory | [ai-crash-course.mdx]
