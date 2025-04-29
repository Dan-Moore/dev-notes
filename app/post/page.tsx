import { posts, slug, details } from "@/lib/io";
import Link from "next/link";


export default function Page() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid gap-6">
        {posts().map((post) => (
          <article key={slug(post.name)} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={`/post/${slug(post.name)}`} className="block space-y-3">
              <h2 className="text-2xl font-bold">{details(post)?.title}</h2>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {details(post)?.description && <p className="text-muted-foreground">{details(post)?.description}</p>}
              <div className="flex gap-2 pt-2">
                {details(post)?.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}