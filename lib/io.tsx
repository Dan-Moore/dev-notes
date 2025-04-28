import fs from "fs";

class mdHeader {
  line: string;
  level: number = 0;

  constructor(line: string) {
    this.line = line

    // Marking non-headers as level 0
    let isHeader = !(line == undefined ||
      line == null ||
      line.trim().charAt(0) !== '#')

    if (isHeader) {
      // searching for level h6 and increments towards h1.
      for (let i = 0; i <= 5; i++) {
        if (line.trim().startsWith('######'.slice(i))) {
          /*  i - pointer for the current header level.
              i(5): #       h1
              i(4): ##      h2
              i(3): ###     h3
              i(2): ####    h4
              i(1): #####   h5
              i(0): ######  h6
          */
          this.level = 6 - i;
          break; // Ending on first match
        }
      }
    }
  }

  label() {
    return this.line.trim().slice(this.level).trim();
  }

  link() {
    return this.label().replace(' ', '-').toLowerCase();
  }
}

/**
 * Returns mdx document from the kt-corner directory.
 *  
 * @remarks
 * The url slug matches to a directory within public/markdown/kt-corner directory.
 * A search query paramater ('page'), is used to indicate which file to load.  
 * 
 * @param slug - App Router URL slug.
 * @param query - Search query paramater. 
 
export async function fetchMDX(filePath: string) {
  const markdownFile = fs.readFileSync(
    filePath,
    'utf-8'
  );
  // Using gray-matter to parse out front-matter content.
  const { data: frontMatter, content } = matter(markdownFile);

  // headers found mardown file.
  let headers = {
    'h1': new Array(),
    'h2': new Array(),
    'h3': new Array(),
    'h4': new Array(),
    'h5': new Array(),
    'h6': new Array(),
  }

  // reading each line and storing found headers.
  for (let line of content.split('\n')) {
    let header = new mdHeader(line)

    // storing found headers.
    if (header.level == 1) {
      headers.h1.push(header);
    } else if (header.level == 2) {
      headers.h2.push(header);
    } else if (header.level == 3) {
      headers.h3.push(header);
    } else if (header.level == 4) {
      headers.h4.push(header);
    } else if (header.level == 5) {
      headers.h5.push(header);
    } else if (header.level == 6) {
      headers.h6.push(header);
    }
  }

  console.log(headers);

  return {
    frontMatter,
    content,
    headers,
  };
}  */