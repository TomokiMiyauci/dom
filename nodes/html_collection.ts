import { type Element } from "./element.ts";
import { type Node } from "./node.ts";
import type { IHTMLCollection } from "../interface.d.ts";
import { find } from "../deps.ts";
import { Namespace } from "../infra/namespace.ts";
import {
  $localName,
  $namespace,
  $namespacePrefix,
  $value,
} from "./internal.ts";
import { Indexer } from "../utils.ts";

export class HTMLCollection extends Indexer<Element | undefined>
  implements IHTMLCollection {
  [index: number]: Element;

  private root: Element;
  private filter: (node: Element) => boolean;

  constructor(root: Element, filter: (node: Element) => boolean) {
    super((index) => this.getItem(index));
    this.root = root;
    this.filter = filter;
  }

  get length(): number {
    return getRepresent(this.root, this.filter).length;
  }

  item(index: number): Element | null {
    return this.getItem(index) ?? null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
   */
  namedItem(key: string): Element | null {
    // 1. If key is the empty string, return null.
    if (key === "") return null;

    // 2. Return the first element in the collection for which at least one of the following is true:
    for (const node of getRepresent(this.root, this.filter)) {
      if (
        // - it has an ID which is key;
        node._ID === key ||
        // - it is in the HTML namespace and has a name attribute whose value is key;
        node.namespaceURI === Namespace.HTML &&
          find(
            node._attributeList,
            (attr) =>
              attr[$localName] === "name" && attr[$namespace] === null &&
              attr[$namespacePrefix] === null && attr[$value] === key,
          )
      ) return node;
    }

    // or null if there is no such element.
    return null;
  }

  *[Symbol.iterator](): IterableIterator<Element> {
    yield* getRepresent(this.root, this.filter);
  }

  private getItem(index: number): Element | undefined {
    return getRepresent(this.root, this.filter)[index];
  }
}

export function getRepresent<T extends Node>(
  node: T,
  filter: (node: T) => boolean,
): T[] {
  const nodes: T[] = [];

  if (filter(node)) nodes.push(node);

  for (const child of node._children) {
    nodes.push(...getRepresent(child, filter));
  }

  return nodes;
}
