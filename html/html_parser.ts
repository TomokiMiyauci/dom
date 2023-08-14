import type { Document } from "../nodes/document.ts";
import { DOMTreeAdapter, type DOMTreeAdapterMap } from "./utils.ts";
import { parse } from "../deps.ts";

export class HTMLParser {
  #adaptor: DOMTreeAdapter;
  constructor(public document: Document) {
    this.#adaptor = new DOMTreeAdapter(document);
  }

  parse(input: string): Document {
    return parse<DOMTreeAdapterMap>(input, { treeAdapter: this.#adaptor });
  }
}
