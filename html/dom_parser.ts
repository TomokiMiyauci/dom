import { type Document } from "../nodes/document.ts";
import type { IDOMParser } from "../interface.d.ts";
import { parse } from "../deps.ts";
import { DOMTreeAdapter, DOMTreeAdapterMap } from "./utils.ts";

export class DOMParser implements IDOMParser {
  parseFromString(string: string, type: DOMParserSupportedType): Document {
    if (type !== "text/html") throw new Error("unimplemented");

    return parse<DOMTreeAdapterMap>(string, {
      treeAdapter: new DOMTreeAdapter(),
    });
  }
}
