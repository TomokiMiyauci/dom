import type { INamedNodeMap } from "../interface.d.ts";
import { find, html, map } from "../deps.ts";
import { getQualifiedName, UnImplemented } from "./utils.ts";
import { List } from "../infra/data_structures/list.ts";
import {
  type Element,
  removeAttributeByName,
  setAttribute,
} from "./element.ts";
import type { Attr } from "./attr.ts";
import {
  $attributeList,
  $element,
  $namespace,
  $nodeDocument,
} from "./internal.ts";
import { Indexer } from "../utils.ts";
import { NamedProperties } from "../webidl/idl.ts";
import { Namespace } from "../infra/namespace.ts";
import { isHTMLDocument } from "./document.ts";
import { DOMExceptionName } from "../webidl/exception.ts";

export interface NamedNodeMapInits {
  element: Element;
  attributeList: List<Attr>;
}

// @Indexer({
//   get: function (this: NamedNodeMap, index: number): Attr | undefined {
//     return this[$attributeList][index];
//   },
// })
@NamedProperties<NamedNodeMap>({
  getSupportedPropertyNames: function () {
    // 1. Let names be the qualified names of the attributes in this NamedNodeMap object’s attribute list, with duplicates omitted, in order.
    const qualifiedNames = map(this[$attributeList], getQualifiedName);
    const names = new Set(qualifiedNames);

    // 2. If this NamedNodeMap object’s element is in the HTML namespace and its node document is an HTML document, then for each name in names:
    const element = this[$element];
    if (
      element[$namespace] === Namespace.HTML &&
      isHTMLDocument(element[$nodeDocument])
    ) {
      names.forEach((name) => {
        // 1. Let lowercaseName be name, in ASCII lowercase.
        const lowercaseName = name.toLowerCase();

        // 2. If lowercaseName is not equal to name, remove name from names.
        if (lowercaseName !== name) names.delete(name);
      });
    }

    // 3. Return names.
    return names;
  },
  getter: function (prop) {
    return this.getNamedItem(prop) ?? undefined;
  },
})
export class NamedNodeMap implements INamedNodeMap {
  readonly [k: number]: Attr;

  [$attributeList]: List<Attr>;
  [$element]: Element;

  constructor({ attributeList, element }: NamedNodeMapInits) {
    this[$attributeList] = attributeList;
    this[$element] = element;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-length
   */
  get length(): number {
    // return the attribute list’s size.
    return this[$attributeList].size;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-item
   */
  item(index: number): Attr | null {
    // 1. If index is equal to or greater than this’s attribute list’s size, then return null.
    // 2. Otherwise, return this’s attribute list[index].
    return this[$attributeList][index] ?? null;
  }

  /**
   * https://dom.spec.whatwg.org/#dom-namednodemap-getnameditem
   */
  getNamedItem(qualifiedName: string): Attr | null {
    // return the result of getting an attribute given qualifiedName and element.
    return getAttributesByName(qualifiedName, this[$element]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-getnameditemns
   */
  getNamedItemNS(namespace: string | null, localName: string): Attr | null {
    // return the result of getting an attribute given namespace, localName, and element.
    return getAttributeByNamespace(namespace, localName, this[$element]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-setnameditem
   */
  setNamedItem(attr: Attr): Attr | null {
    // return the result of setting an attribute given attr and element.
    return setAttribute(attr, this[$element]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-setnameditemns
   */
  setNamedItemNS(attr: Attr): Attr | null {
    // return the result of setting an attribute given attr and element.
    return setAttribute(attr, this[$element]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
   */
  removeNamedItem(qualifiedName: string): Attr {
    // 1. Let attr be the result of removing an attribute given qualifiedName and element.
    const attr = removeAttributeByName(qualifiedName, this[$element]);

    // 2. If attr is null, then throw a "NotFoundError" DOMException.
    if (!attr) {
      throw new DOMException("<message>", DOMExceptionName.NotFoundError);
    }

    // 3. Return attr.
    return attr;
  }

  removeNamedItemNS(namespace: string | null, localName: string): Attr {
    throw new UnImplemented("removeNamedItemNS");
  }

  // TODO(miyauci): Find the definition of WebIDL.
  *[Symbol.iterator](): IterableIterator<Attr> {
    const length = this.length;
    for (let i = 0; i < length; i++) yield this[i]!;
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
