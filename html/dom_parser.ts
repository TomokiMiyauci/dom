import { Document } from "../dom/nodes/documents/document.ts";
import type { IDOMParser } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { HTMLParser } from "./html_parser.ts";
import {
  executeScriptElement,
  prepareScriptElement,
} from "./elements/scripting/html_script_element_utils.ts";
import { fireEvent } from "../dom/events/fire.ts";

export class DOMParser implements IDOMParser {
  parseFromString(
    string: string,
    type: DOMParserSupportedType,
  ): globalThis.Document {
    const document = new Document();

    $(document).contentType = type;

    if (globalThis.location) {
      $(document).URL = new URL(globalThis.location.href);
    }

    switch (type) {
      case "text/html": {
        $(document).type = "html";

        const parser = new HTMLParser(document);
        const result = parser.parse(string);

        Object.defineProperty(globalThis, "parent", {
          value: globalThis,
          configurable: true,
        });

        Object.defineProperty(globalThis, "document", {
          value: result,
          configurable: true,
        });

        queueMicrotask(async () => {
          for (const script of result.scripts) {
            await prepareScriptElement(script);
          }

          for (const script of result.scripts) {
            executeScriptElement(script);
            fireEvent("load", script);
          }

          dispatchEvent(new Event("load"));
        });

        return result;
      }

      default: {
        throw new Error("unimplemented");
      }
    }
  }
}
