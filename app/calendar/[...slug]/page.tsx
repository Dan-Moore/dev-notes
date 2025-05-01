import { notFound } from "next/navigation"
import { Metadata } from "next"
import { components } from "@/components/mdx-components"
import { MDXRemote } from "next-mdx-remote/rsc"
import { events, MarkdownFile } from "@/lib/io"

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
      (file) => (file.link.trim().match((process.env.CALENDAR_BASE + "/" +slug).trim())))
  }
  return foundFile;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const file: MarkdownFile | undefined = await getPageFromParams(params)
  
  if (!file) {
    return {}
  }

  return {
    title: file.details.title,
    description: file.details.desc,
  }
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  let params = []
  for(const event of events()) {
    for(const file of event.files){
      params.push({
        slug: file.link.split('/')
      })
    }    
  }
  return params
}

export default async function PagePage({ params }: PageProps) {
  const markdown = await getPageFromParams(params)
  if (!markdown) {
    notFound()
  }

  return (
    <article className="py-10 prose dark:prose-invert ">
      <MDXRemote source={markdown.content} components={components} />
    </article>
  )
}