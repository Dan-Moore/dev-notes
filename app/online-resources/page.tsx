import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { components } from "@/components/mdx";

import { AppResources, DevNote, MarkdownFile } from "@/lib/nightly/consts";
import { all } from "@/lib/nightly/io";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { makeNote } from "@/lib/nightly/utils";
import { MDXRemote } from "next-mdx-remote/rsc";

async function getNotes() {
  const files = await all(AppResources["online-resources"]);
  const about_files = files.filter((_f) => _f.name == "about.mdx");
  const notes = about_files.map((_f) => {
    return makeNote(_f);
  });
  return notes;
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const notes = await getNotes();
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="w-full">
                <div className="flex items-center py-4">
                  <Table>
                    <TableBody>
                      {notes.map((note) => (
                        <Sheet>
                          <SheetTrigger asChild>
                            <TableRow>
                              <TableCell className="h-24 text-center">
                                {note.title}
                              </TableCell>
                              <TableCell className="h-24 text-center">
                              {note.description}
                              </TableCell>
                            </TableRow>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>E{note.title}</SheetTitle>
                              <SheetDescription>
                              {note.description}
                              </SheetDescription>
                            </SheetHeader>
                            <MDXRemote source={note.markdown.content} components={components} />
                            <SheetFooter></SheetFooter>
                          </SheetContent>
                        </Sheet>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
