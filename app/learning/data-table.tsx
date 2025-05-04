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
import { MarkdownDirectory } from "@/lib/io";
import { fetchFiles } from "@/lib/utils";


export function DataTable({ data }) {
  const dirs: MarkdownDirectory[] = JSON.parse(data);
  const files = fetchFiles(dirs);
  //console.log(files)

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Presenters</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => ( 
              <TableRow key={file.name}>
                <TableCell className="h-24 text-center">{file.details.title}</TableCell>
                <TableCell className="h-24 text-center">{file.details.title}</TableCell>
                <TableCell className="h-24 text-center">{file.details.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
