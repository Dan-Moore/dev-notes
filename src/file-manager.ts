import { walk, WalkEntry } from "$std/fs/walk.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { deflateSync, inflateSync } from "node:zlib";
import { Buffer } from "node:buffer";
import process from "node:process";
import { MarkdownEntity } from "./content-manager.ts";

/** Local consts */
const _ = {
  paths: { local: "./content" },
};

/** Helper object to work with files. */
export const FileManager = () => {
  return {
    /** zlib deflate on text to base64 string */
    deflate: (input: string) => {
      return _deflate(input);
    },
    /** Restores a base64 string back into it's orginal text. */
    inflate: (input: string) => {
      return _inflate(input);
    },
    /** Directory walk on local content folder. */
    walk: async (path: string = _.paths.local, exts: string[] = [".md"]) => {
      // os walk on local content directory.
      const files: WalkEntry[] = await Array.fromAsync(walk(path));
      // returning list any found markdown documents.
      return files.filter((entry) => {
        if (!entry.isFile) {
          return false;
        }

        // keeping any found extension matches.
        for (const ext of exts) {
          if (entry.name.endsWith(ext)) {
            return true;
          }
        }

        return false;
      });
    },

    /** Returns a MarkdownEntity tuple that contains ['file-path', 'file-contents', 'key-value pairs'] */
    parse: async (path: string) => {
      // Reading in file as raw string.
      const content = await Deno.readTextFile(path);
      try {
        // Slicing front-matter headers out of file.
        const { attrs, body } = extract(content);
        return {path: path, body: _deflate(body), kv: attrs};
      } catch (error) {
        // Error triggers when md file lacks a front-matter header.
        if (error instanceof TypeError) {
          return {path: path, body: _deflate(content), kv:{}}; // returning text file back with empty kv record.
        }
      }

      throw new Error("Failed to parse: " + path);
    },
  };
};

/**
 * User-defined type guard to check if an unknown value is a WalkEntry.
 * A WalkEntry typically has 'path', 'isFile', 'isDirectory', and 'isSymlink' properties.
 *
 * @param arg The value to check.
 * @returns True if the value conforms to WalkEntry, false otherwise.
 */
export function isWalkEntry(arg: any): arg is WalkEntry {
  return (
    typeof arg === "object" &&
    arg !== null &&
    typeof arg.path === "string" &&
    typeof arg.isFile === "boolean" &&
    typeof arg.isDirectory === "boolean" &&
    typeof arg.isSymlink === "boolean"
  );
}

function _deflate(input: string): string {
  return deflateSync(input).toString("base64");
}

function _inflate(input: string): string {
  return inflateSync(Buffer.from(input, "base64"))
    .toString();
}
