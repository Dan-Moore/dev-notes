import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { Head } from "$fresh/runtime.ts";
import { CSS, render } from "@deno/gfm";
import { FileManager } from "../../src/file-manager.ts";
import { SqlManager } from "../../src/sql-manager.ts";
import { fetchContent } from "../../src/content-manager.ts";
import { _globToRegExp } from "$std/path/_common/glob_to_reg_exp.ts";

interface Page {
  content: string;
  meta: Record<string, unknown>;
}

export const handler: Handlers<Page> = {
  // todo: update get to read from sqlite.
  //    - while on dev, show latest content from local

  async GET(_req, ctx) {
    if (ctx.params.slug) {
      const path = `content/posts/${ctx.params.slug}.md`
      const [_path, body, kv] = await fetchContent(path);
      return ctx.render({ content: body, meta: kv });
    }

    // Case: no document found.
    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data }: PageProps<Page | null>) {
  if (!data) {
    return <h1>File not found.</h1>;
  }

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main>
        <div>{JSON.stringify(data.meta)}</div>
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: render(data?.content) }}
        />
      </main>
    </>
  );
}
