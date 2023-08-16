import { type Element } from "./element.ts";
import type { IHTMLCollection } from "../interface.d.ts";
import { find, first, islice, len } from "../deps.ts";
import { Namespace } from "../infra/namespace.ts";
import {
  $localName,
  $namespace,
  $namespacePrefix,
  $value,
} from "./internal.ts";
import { Indexer } from "../utils.ts";
import { Collection } from "./collection.ts";

function getElementByIndex(
  this: HTMLCollection,
  index: number,
): Element | undefined {
  return this.getItem(index);
}

@Indexer(getElementByIndex)
export class HTMLCollection extends Collection<Element>
  implements IHTMLCollection {
  [index: number]: Element;

  constructor(root: Element, filter: (node: Element) => boolean) {
    super({ root, filter });
  }

  get length(): number {
    return len(this.represent());
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
    for (const node of this.represent()) {
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
    yield* this.represent();
  }

  protected getItem(index: number): Element | undefined {
    if (!Number.isInteger(index)) return undefined;

    return first(islice(this.represent(), index, index + 1));
  }
}
