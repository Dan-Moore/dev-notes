import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { YouTubeEmbed } from "@next/third-parties/google";


// Content for these pages will be fetched with getPost function.
// This function is called at build time.
// It returns the content of the post with the matching slug.
// It also returns the slug itself, which Next.js will use to determine which page to render at build time.
//For example, { props: { slug: "my-first-post", content: "..." } }
async function getPost({ slug }: { slug: string }) {  
    const markdownFile = fs.readFileSync(
    path.join(process.env.BLOG_DIR , slug + ".mdx"),
    "utf-8"
  );
  const { data: frontMatter, content } = matter(markdownFile);
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
  const files = fs.readdirSync(process.env.BLOG_DIR);
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

  // Customize components for MDX rendering.
  // For example, the Code component will render code blocks with syntax highlighting.
  // The YouTube component will render YouTube videos.
  const components = {
    YouTubeEmbed
  };

  return (
    <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto">
      <h1>{props.frontMatter.title}</h1>
      <MDXRemote source={props.content} components={components} />
    </article>
  );
}