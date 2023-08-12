import { type Element } from "./element.ts";
import { type Node } from "./node.ts";
import type { IHTMLCollection } from "../interface.d.ts";
import { find } from "../deps.ts";
import { UnImplemented } from "./utils.ts";
import { Namespace } from "../infra/namespace.ts";

export class HTMLCollection implements IHTMLCollection {
  _root: Node;
  _filter: (node: Element) => boolean;

  constructor(root: Node, filter: (node: Element) => boolean) {
    this._root = root;
    this._filter = filter;
  }

  get length(): number {
    return getRepresent(this._root, this._filter).length;
  }

  item(index: number): Element | null {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
   */
  namedItem(key: string): Element | null {
    // 1. If key is the empty string, return null.
    if (key === "") return null;

    // 2. Return the first element in the collection for which at least one of the following is true:
    for (const node of getRepresent(this._root, this._filter)) {
      if (
        // - it has an ID which is key;
        node._ID === key ||
        // - it is in the HTML namespace and has a name attribute whose value is key;
        node.namespaceURI === Namespace.HTML &&
          find(
            node._attributeList,
            (attr) =>
              attr._localName === "name" && attr._namespace === null &&
              attr._namespacePrefix === null && attr._value === key,
          )
      ) return node;
    }

    // or null if there is no such element.
    return null;
  }

  *[Symbol.iterator](): IterableIterator<Element> {
    yield* getRepresent(this._root, this._filter);
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
