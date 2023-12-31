import type { IHTMLCollection } from "../interface.d.ts";
import { at, find, len, range } from "../deps.ts";
import { Namespace } from "../_internals/infra/namespace.ts";
import { isElement } from "./utils/type.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import {
  LegacyPlatformObject,
  LegacyUnenumerableNamedProperties,
} from "../_internals/webidl/legacy_extended_attributes.ts";
import { Getter, getter, WebIDL } from "../_internals/webidl/idl.ts";
import {
  convert,
  DOMString,
  unsignedLong,
} from "../_internals/webidl/types.ts";
import { tree } from "../internal.ts";
import { $Element, $Node } from "../i.ts";
import * as $$ from "../symbol.ts";

export const $root = Symbol();
export const $filter = Symbol();

@Exposed("Window", "HTMLCollection")
@LegacyUnenumerableNamedProperties
export class HTMLCollection extends LegacyPlatformObject
  implements IHTMLCollection {
  private [$root]: $Node;
  private [$filter]: (element: $Element) => boolean;

  constructor(
    { root, filter }: { root: $Node; filter: (element: $Element) => boolean },
  ) {
    super();

    this[$root] = root;
    this[$filter] = filter;
  }

  [WebIDL.supportedIndexes](): Set<number> {
    const count = len(this.represent());

    return new Set(range(0, count));
  }

  [WebIDL.supportedNamedProperties](): Set<string> {
    const set = new Set<string>();

    for (const element of this.represent()) {
      const id = element[$$.ID];

      if (typeof id === "string") set.add(id);
      if (element[$$.namespace] === Namespace.HTML) {
        const value = element.getAttribute("name");

        if (value) set.add(value);
      }
    }

    return set;
  }

  get length(): number {
    return len(this.represent());
  }

  @convert
  @getter("index")
  item(@unsignedLong index: number): $Element | null {
    return at(this.represent(), index) ?? null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
   */
  @convert
  @getter("name")
  namedItem(@DOMString key: string): $Element | null {
    // 1. If key is the empty string, return null.
    if (key === "") return null;

    // 2. Return the first element in the collection for which at least one of the following is true:
    return find(this.represent(), (element) =>
      // - it has an ID which is key;
      element[$$.ID] === key ||
      // - it is in the HTML namespace and has a name attribute whose value is key;
      (element[$$.namespace] === Namespace.HTML &&
        element.getAttribute("name") === key)) ?? null; // or null if there is no such element.
  }

  protected *represent(): IterableIterator<$Element> {
    for (const node of tree.inclusiveDescendants(this[$root])) {
      if (isElement(node) && this[$filter](node)) yield node;
    }
  }

  [Symbol.iterator] = Array.prototype.values;
}

export interface HTMLCollection
  extends Getter<"index", $Element>, Getter<"name", $Element> {}
