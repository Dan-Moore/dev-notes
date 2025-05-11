import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx";
import { env } from "@/lib/consts";
import { fetch, posts } from "@/lib/io";
import { SiteFooter } from "@/components/site-footer";

async function getPost({ slug }: { slug: string }) {  
  const post = fetch(env.dirs.posts, `${slug}.mdx`)
  return post;
}

export async function generateStaticParams() {
  const params = posts().map((file) => ({
    slug: file.name.replace(".mdx", ""),
  }));

  return params;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const page = await getPost(await props.params);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
    <div className="grid gap-6 pb-6">
      <MDXRemote source={page.raw()} components={components} />
    </div>
    <SiteFooter />    
    </main>
  );
}
