import { Document } from "../../nodes/documents/document.ts";
import type { IDOMParser } from "../../interface.d.ts";
import { $ } from "../../internal.ts";
import { HTMLParser } from "./html_parser.ts";
import {
  executeScriptElement,
  prepareScriptElement,
} from "./elements/scripting/html_script_element_utils.ts";
import { fireEvent } from "../../events/fire.ts";
import { Exposed } from "../webidl/extended_attribute.ts";

@Exposed("Window", "DOMParser")
export class DOMParser implements IDOMParser {
  parseFromString(
    string: string,
    type: DOMParserSupportedType,
  ): globalThis.Document {
    const document = new Document();

    $(document).contentType = type;
    if (globalThis.document) $(document).URL = $(globalThis.document).URL;

    switch (type) {
      case "text/html": {
        $(document).type = "html";

        const parser = new HTMLParser(document);
        const result = parser.parse(string);

        queueMicrotask(async () => {
          for (const script of result.scripts) {
            await prepareScriptElement(script);
          }

          for (const script of result.scripts) {
            executeScriptElement(script);
            fireEvent("load", script);
          }

          fireEvent("load", globalThis);
        });

        return result;
      }

      default: {
        throw new Error("unimplemented");
      }
    }
  }
}
