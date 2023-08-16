import type { INamedNodeMap } from "../interface.d.ts";
import { find, html } from "../deps.ts";
import { UnImplemented } from "./utils.ts";
import { List } from "../infra/list.ts";
import { type Element, setAttribute } from "./element.ts";
import type { Attr } from "./attr.ts";
import { $attributeList, $element } from "./internal.ts";

export interface NamedNodeMapInits {
  element: Element;
  attributeList: List<Attr>;
}

export class NamedNodeMap implements INamedNodeMap {
  [k: number]: Attr;

  [$attributeList]: List<Attr>;
  [$element]: Element;

  constructor({ attributeList, element }: NamedNodeMapInits) {
    this[$attributeList] = attributeList;
    this[$element] = element;
  }

  get length(): number {
    return this[$attributeList].size;
  }

  item(index: number): Attr | null {
    return this[$attributeList][index] ?? null;
  }

  getNamedItem(qualifiedName: string): Attr | null {
    return getAttributesByName(qualifiedName, this[$element]);
  }

  getNamedItemNS(namespace: string | null, localName: string): Attr | null {
    return getAttributeByNamespace(namespace, localName, this[$element]);
  }

  setNamedItem(attr: Attr): Attr | null {
    return setAttribute(attr, this[$element]);
  }

  setNamedItemNS(attr: Attr): Attr | null {
    return setAttribute(attr, this[$element]);
  }

  removeNamedItem(qualifiedName: string): Attr {
    throw new UnImplemented();
  }

  removeNamedItemNS(namespace: string | null, localName: string): Attr {
    throw new UnImplemented();
  }

  *[Symbol.iterator](): IterableIterator<Attr> {
    throw new UnImplemented();
  }
}

function getAttributesByName(
  qualifiedName: string,
  element: Element,
): Attr | null {
  // 1. If element is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
  if (
    element.namespaceURI === html.NS.HTML
    // TODO
  ) {
    qualifiedName = qualifiedName.toLowerCase();
  }

  return find(element[$attributeList], (attr) => {
    const q = attr.prefix === null
      ? attr.localName
      : attr.prefix + ":" + attr.localName;

    return q === qualifiedName;
  }) ?? null;
}

function getAttributeByNamespace(
  namespace: string | null,
  localName: string,
  element: Element,
): Attr | null {
  namespace ||= null;

  return find(element[$attributeList], (attr) => {
    return attr.namespaceURI === namespace && attr.localName === localName;
  }) ?? null;
}
