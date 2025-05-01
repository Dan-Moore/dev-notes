
import { MDXRemote } from "next-mdx-remote/rsc";
import { YouTubeEmbed } from "@next/third-parties/google";
import { walk, parse } from "@/lib/io";
import { notFound } from "next/navigation";

/**
 * Builds static params during build time.
 * @remarks
   * See the offical documentation here:
   * {@link https://nextjs.org/docs/app/api-reference/functions/generate-static-params | Nextjs Doc}.
 */
export async function generateStaticParams() {
  // os walk through /public/markdown/calendar 
  // todo - add support for nested dirs; maybe add archive support
  const files = walk(process.env.CALENDAR_EVENTS)
  const params = files.map((file) => ({
    slug: file.name,
  }));

  return params;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const event = await fetchEvent(params);
  console.log(event)
  return (
    <MDXRemote source={event.content} components={{ YouTubeEmbed }} />
  );
}

// todo atm, scripts are shared between calendar and event page.
/*
export async function fetchEvent({ slug }: { slug: string }) {
  // file = parse("public/markdown/calendar", "pycon-2025", )
  const file = parse(process.env.DIR_CALENDAR, slug + ".mdx")
  if (!file["content"]) {
    notFound() // switching to 404 page. Possible use case, no mdx file for the incoming slug.
  }

  appendEventDate(file)
  return file;
}


function appendEventDate(file: { pwd: string; name: string; path: string; meta: { [key: string]: any; }; content: string; } | { pwd: string; name: string; path: string; meta: string; content: string; }) {
  // No dates found in front-matter.
  if (!file.meta["dates"]) {
      console.error(`No date found in front-matter header! file:${JSON.stringify(file)}`)
      return file;
  } 

  // Making a new property field on files object with Date objects
  file["dates"] = []
  for(const i in file.meta["dates"]) {
    file["dates"].push(new Date(file.meta["dates"][i]))
  }
  
  
  return file;
}
*/