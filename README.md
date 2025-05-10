[md](public/images/markdown.svg)

# Hello World
This website was build with [Next.js](https://nextjs.org/docs) and [shadcn](https://ui.shadcn.com/).

## NPM Cheat Sheet
Following are some basic npm commands for 
- `npm install` - Downloads and install npm packages.  Review [package.json](/package.json)
- `npm update` - Updates npm packages
- `npm run dev` - Runs a local instance at [http://localhost:3000](http://localhost:3000) or next available port #

## Markdown
Most pages will be written in markdown. A [root](/public/markdown/) directory houses folders used by [App Router](https://nextjs.org/docs/app/building-your-application/routing). 

Re-useable environment variables have been added to [.env](/.env) 
Sample use case: `process.env.MD_DIR`

To render a markdown page.  [MDXRemote](https://nextjs.org/docs/app/guides/mdx) is used to load in the page content.
```typescript
<div className="flex-1 p-6">
  <MDXRemote source={event.banner.content} components={components} />
</div>
```

### Parsing Markdown Docs
See [io.ts](/lib/io.ts).
