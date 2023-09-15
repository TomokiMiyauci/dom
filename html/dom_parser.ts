import { Document } from "../dom/nodes/documents/document.ts";
import type { IDOMParser } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { HTMLParser } from "./html_parser.ts";

export class DOMParser implements IDOMParser {
  parseFromString(
    string: string,
    type: DOMParserSupportedType,
  ): globalThis.Document {
    const document = new Document() as globalThis.Document;
    $(document).contentType = type;
    // document[$URL] = globalThis.window.document.URL;

    switch (type) {
      case "text/html": {
        $(document).type = "html";
        const parser = new HTMLParser(document);

        return parser.parse(string);
      }

      default: {
        throw new Error("unimplemented");
      }
    }
  }
}
