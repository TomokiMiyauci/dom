import type { INamedNodeMap } from "../interface.d.ts";
import { html } from "./deps.ts";
import { UnImplemented } from "./utils.ts";
import { type Element, setAttribute } from "./element.ts";
import type { Attr } from "./attr.ts";

const attributeList = Symbol();

export class NamedNodeMap implements INamedNodeMap {
  [attributeList]: Attr[] = [];

  constructor(public element: Element) {}

  get length(): number {
    return this[attributeList].length;
  }

  item(index: number): Attr | null {
    return this[attributeList][index] ?? null;
  }

  getNamedItem(qualifiedName: string): Attr | null {
    return getAttributesByName(qualifiedName, this.element);
  }

  getNamedItemNS(namespace: string | null, localName: string): Attr | null {
    return getAttributeByNamespace(namespace, localName, this.element);
  }

  setNamedItem(attr: Attr): Attr | null {
    return setAttribute(attr, this.element);
  }

  setNamedItemNS(attr: Attr): Attr | null {
    return setAttribute(attr, this.element);
  }

  removeNamedItem(qualifiedName: string): Attr {
    throw new UnImplemented();
  }

  removeNamedItemNS(namespace: string | null, localName: string): Attr {
    throw new UnImplemented();
  }

  [k: number]: any;
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

  return element.attributes[attributeList].find((attr) => {
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

  return element.attributes[attributeList].find((attr) => {
    return attr.namespaceURI === namespace && attr.localName === localName;
  }) ?? null;
}
