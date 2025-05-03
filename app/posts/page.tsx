

import { posts } from "@/lib/io";
import Link from "next/link";
import Tri from "./foo";

export default function Page() {

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Dev Notes</h1>
      <Tri />
      <div className="grid gap-6">
        {posts().map((post) => (
          <article key={post.link} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={post.link} className="block space-y-3">
              <h2 className="text-2xl font-bold">{post?.details?.title}</h2>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {post?.details?.desc && <p className="text-muted-foreground">{post?.details?.desc}</p>}
              <div className="flex gap-2 pt-2">
                {(post.details.tags) ? post.details.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {tag}
                  </span>
                )): <></>}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}