import { Document } from "../dom/nodes/documents/document.ts";
import type { IDOMParser } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { HTMLParser } from "./html_parser.ts";
import {
  executeScriptElement,
  prepareScriptElement,
} from "./elements/scripting/html_script_element_utils.ts";
import { resolver } from "./internal.ts";

export class DOMParser implements IDOMParser {
  parseFromString(
    string: string,
    type: DOMParserSupportedType,
    options?: {
      baseURL: URL;
      resolveURL: (src: string, baseURL: URL) => URL;
      fetch: (url: URL) => Uint8Array;
    },
  ): globalThis.Document {
    const document = new Document();

    $(document).contentType = type;

    if (options) {
      $(document).URL = options.baseURL;
      resolver.resolveURL = options.resolveURL.bind(options);
      resolver.fetch = options.fetch.bind(options);
    }

    switch (type) {
      case "text/html": {
        $(document).type = "html";

        const parser = new HTMLParser(document);
        const result = parser.parse(string);

        for (const script of result.scripts) prepareScriptElement(script);

        Object.defineProperty(globalThis, "parent", {
          value: globalThis,
          configurable: true,
        });

        Object.defineProperty(globalThis, "document", {
          value: result,
          configurable: true,
        });

        for (const script of result.scripts) executeScriptElement(script);

        return result;
      }

      default: {
        throw new Error("unimplemented");
      }
    }
  }
}
