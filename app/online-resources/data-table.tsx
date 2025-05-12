"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FileDetails, MarkdownFile } from "@/lib/nightly/consts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function getBanners(files: MarkdownFile[]): MarkdownFile[] {
  return files.filter(_f => _f.name == 'banner.mdx');
}

export function details(meta:{
  [key: string]: any;
}): FileDetails {
  return {
    // Storing either 'desc' or 'description'
    description: meta["desc"] ? meta["desc"] : meta["description"],
    title: meta["title"],
    tags: meta["tags"] ? meta["tags"] : [],
    draft: meta["draft"] ? meta["draft"] == "false" : true,
    publish: meta["publish"] ? new Date(meta["publish"]) : undefined,
    modified: meta["modified"] ? new Date(meta["modified"]) : new Date(),
  };
}

export function DataTable({files}) {
  const _dets = getBanners(files).map(file => details(file.meta) )
  console.log(_dets)
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Table>
          {/* 
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          */}
          <TableBody>
            {_dets.map((det) => ( 
              <BuildRow title={det.title} description={det.description} tags={det.tags} draft={det.draft} modified={det.modified} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function BuildRow(det: FileDetails) {
  return (<>
  <Sheet>
      <SheetTrigger asChild>
        <TableRow key={det.title}> 
                <TableCell className="h-24 text-center">{det.title}</TableCell>
                <TableCell className="h-24 text-center">{det.description}</TableCell>
              </TableRow>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  </>);
}