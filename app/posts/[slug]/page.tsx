import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx";
import { dirs } from "@/lib/consts";
import { fetch, archive, posts } from "@/lib/io";
import { SiteFooter } from "@/components/site-footer";

// Content for these pages will be fetched with getPost function.
// This function is called at build time.
// It returns the content of the post with the matching slug.
// It also returns the slug itself, which Next.js will use to determine which page to render at build time.
//For example, { props: { slug: "my-first-post", content: "..." } }
async function getPost({ slug }: { slug: string }) {  
    //const markdownFile = fs.readFileSync(
    //path.join(dirs.posts, slug + ".mdx"),
    //"utf-8"
  //);
  //console.log(`slug = ` + slug)
  const post = fetch(dirs.posts, `${slug}.mdx`)

  const { data: frontMatter, content } = matter(post.raw());
  return {
    frontMatter,
    slug,
    content,
  };
}

// generateStaticParams generates static paths for blog posts.
// This function is called at build time.
// It returns an array of possible values for slug.
// For example, [{ params: { slug: "my-first-post" } }, { params: { slug: "my-second-post" } }]
export async function generateStaticParams() {
  const files = fs.readdirSync(dirs.posts);
  const params = files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));

  return params;
}

export default async function Page(props0: { params: Promise<{ slug: string }> }) {
  const params = await props0.params;
  // Params contains the post `slug`

  // Fetch the post content based on the slug
  const props = await getPost(params);


  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
    <div className="grid gap-6">
      <MDXRemote source={props.content} components={components} />
    </div>
    <SiteFooter />
    </main>
  );
}
