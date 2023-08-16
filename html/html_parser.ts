import type { Document } from "../nodes/document.ts";
import type { Element } from "../nodes/element.ts";
import type { Node } from "../nodes/node.ts";
import { DOMTreeAdapter, type DOMTreeAdapterMap } from "./utils.ts";
import { List } from "../infra/list.ts";
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

/**
 * @see https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm
 */
export function parseHTMLFragment(
  context: Element,
  input: string,
): List<Node> {
  throw new Error();
}
