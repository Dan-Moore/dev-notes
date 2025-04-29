import { getPosts } from "@/lib/io";
import Link from "next/link";

export default function Page() {
  const posts = getPosts()

    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.name} className="border rounded-lg p-6 hover:shadow-md transition">
            <Link href={`/p/${post.name.slice(0, post.name.lastIndexOf('.')) || post.name}`} className="block space-y-3">
              <h2 className="text-2xl font-bold">{post.name}</h2>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {post.name && <p className="text-muted-foreground">{post.name}</p>}
              <div className="flex gap-2 pt-2">
                
                {["java", "js"].map((tag) => (
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
  