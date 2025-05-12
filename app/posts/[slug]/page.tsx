import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx";
import { SiteFooter } from "@/components/site-footer";
import { all, find } from "@/lib/nightly/io";
import { AppResources } from "@/lib/nightly/consts";



export async function generateStaticParams() {
  const files = await all(AppResources.posts);
  
  // building slugs for params
  const params = files.map((file) => ({
    // removing file path to make slug
    slug: file.name.replace(".mdx", ""),
  }));

  return params;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  // Getting the markdown doc from slug
  const params = await props.params;
  const file = await find(AppResources.posts, params.slug);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
    <div className="grid gap-6">
      <MDXRemote source={file.raw()} components={components} />
    </div>
    <SiteFooter />
    </main>
  );
}
