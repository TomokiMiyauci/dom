/** {@linkcode Node} algorithms
 * @module
 */

import { isElement, isText } from "./utils.ts";
import { getDocumentElement } from "./node_trees/node_tree.ts";
import { HTMLCollection } from "./node_trees/html_collection.ts";
import { Namespace } from "../../_internals/infra/namespace.ts";
import { html, iter, izip, takewhile } from "../../deps.ts";
import {
  matchASCIICaseInsensitive,
  toASCIILowerCase,
} from "../../_internals/infra/string.ts";
import { parseOrderSet } from "../infra/ordered_set.ts";
import { $, tree } from "../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
 */
export function getElementsByQualifiedName(
  qualifiedName: string,
  root: Node,
): HTMLCollection {
  // 1. If qualifiedName is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches only descendant elements.
  if (qualifiedName === "*") {
    return new HTMLCollection({ root, filter: (node) => node !== root });
  }

  // 2. Otherwise, if root’s node document is an HTML document, return an HTMLCollection rooted at root, whose filter matches the following descendant elements:
  if ($($(root).nodeDocument).type !== "xml") {
    return new HTMLCollection({
      root,
      filter: (element) =>
        element !== root &&
          // - Whose namespace is the HTML namespace and whose qualified name is qualifiedName, in ASCII lowercase.
          ($(element).namespace === Namespace.HTML &&
            $(element).qualifiedName === toASCIILowerCase(qualifiedName)) ||
        // - Whose namespace is not the HTML namespace and whose qualified name is qualifiedName.
        ($(element).namespace !== Namespace.HTML &&
          $(element).qualifiedName === qualifiedName),
    });
  }

  // 3. Otherwise, return an HTMLCollection rooted at root, whose filter matches descendant elements whose qualified name is qualifiedName.
  return new HTMLCollection({
    root,
    filter: (element) =>
      element !== root && $(element).qualifiedName === qualifiedName,
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 */
export function getElementsByClassName(
  classNames: string,
  root: Node,
): HTMLCollection {
  const classes = parseOrderSet(classNames);

  if (classes.isEmpty) return new HTMLCollection({ root, filter: () => false });

  const match = $($(root).nodeDocument).mode === html.DOCUMENT_MODE.QUIRKS
    ? matchASCIICaseInsensitive
    : Object.is;

  return new HTMLCollection({
    root,
    filter: (node) => {
      if (node === root) return false;

      return iter(classes).every((left) => {
        for (const right of node.classList) if (match(left, right)) return true;

        return false;
      });
    },
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 */
export function getElementsByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  root: Node,
): HTMLCollection {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. If both namespace and localName are U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements.
  if (namespace === "*" && localName === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => root !== element,
    });
  }

  // 3. If namespace is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements whose local name is localName.
  if (namespace === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => {
        if (element === root) return false;

        return $(element).localName === localName;
      },
    });
  }

  // 4. If localName is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace.
  if (localName === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => {
        if (element === root) return false;

        return $(element).namespace === namespace;
      },
    });
  }

  // 5. Return an HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace and local name is localName.
  return new HTMLCollection({
    root,
    filter: (element) => {
      if (element === root) return false;

      return $(element).namespace === namespace &&
        $(element).localName === localName;
    },
  });
}

/**
 * @see https://dom.spec.whatwg.org/#parent-element
 */
export function getParentElement(node: Node): Element | null {
  const parent = tree.parent(node);

  // If the node has a parent of a different type, its parent element is null.
  return parent && isElement(parent) ? parent : null;
}

export function getInterface(node: Node, nodeType: number): Element | null {
  switch (nodeType) {
    case node.ELEMENT_NODE:
      // Return the result of locating a namespace prefix for it using namespace.
      return (node as Element);
    case node.DOCUMENT_NODE:
      // Return the result of locating a namespace prefix for its document element, if its document element is non-null; otherwise null.
      return getDocumentElement(node);
    case node.DOCUMENT_TYPE_NODE:
    case node.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;
    case node.ATTRIBUTE_NODE:
      // Return the result of locating a namespace prefix for its element, if its element is non-null; otherwise null.
      return $(node as Attr).element;
    default:
      // Return the result of locating a namespace prefix for its parent element, if its parent element is non-null; otherwise null.
      return getParentElement(node);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#locate-a-namespace-prefix
 */
export function locateNamespacePrefix(
  element: Element,
  namespace: string,
): string | null {
  // 1. If element’s namespace is namespace and its namespace prefix is non-null, then return its namespace prefix.
  if (
    $(element).namespace === namespace && $(element).namespacePrefix !== null
  ) return $(element).namespacePrefix;

  const { attributeList } = $(element);
  // 2. If element has an attribute whose namespace prefix is "xmlns" and value is namespace, then return element’s first such attribute’s local name.
  const attribute = iter(attributeList).find((attr) =>
    $(attr).namespacePrefix === Namespace.XMLNS &&
    $(attr).value === namespace
  );

  if (attribute) return $(attribute).localName;

  // 3. If element’s parent element is not null, then return the result of running locate a namespace prefix on that element using namespace.
  const parent = getParentElement(element);

  if (parent) return locateNamespacePrefix(parent, namespace);

  // 4. Return null.
  return null;
}

/**
 * @see https://dom.spec.whatwg.org/#locate-a-namespace
 */
export function locateNamespace(
  node: Node,
  prefix: string | null,
): string | null {
  // switch on the interface node implements:
  switch (node.nodeType) {
    case node.ELEMENT_NODE: {
      // 1. If prefix is "xml", then return the XML namespace.
      if (prefix === "xml") return Namespace.XML;

      // 2. If prefix is "xmlns", then return the XMLNS namespace.
      if (prefix === "xmlns") return Namespace.XMLNS;

      const element = node as Element;
      const namespace = $(element).namespace;

      // 3. If its namespace is non-null and its namespace prefix is prefix, then return namespace.
      if (namespace !== null && $(element).namespacePrefix === prefix) {
        return namespace;
      }

      const attrList = $(element).attributeList;

      // 4. If it has an attribute whose namespace is the XMLNS namespace, namespace prefix is "xmlns", and local name is prefix,
      const hasAttr = iter(attrList)
        .find((attr) => {
          const { namespace, namespacePrefix, localName } = $(attr);

          return namespace === Namespace.XMLNS &&
            namespacePrefix === "xmlns" &&
            localName === prefix;
        });

      // or if prefix is null and it has an attribute whose namespace is the XMLNS namespace, namespace prefix is null, and local name is "xmlns",
      const attribute = hasAttr ??
        (prefix === null
          ? iter(attrList).find((attr) => isXMLNamespace($(attr)))
          : null);

      // then return its value if it is not the empty string, and null otherwise.
      if (attribute) return $(attribute).value || null;

      const parentElement = getParentElement(element);

      // 5. If its parent element is null, then return null.
      if (parentElement === null) return null;

      // 6. Return the result of running locate a namespace on its parent element using prefix.
      return locateNamespace(parentElement, prefix);
    }

    case node.DOCUMENT_NODE: {
      const documentElement = getDocumentElement(node);
      // 1. If its document element is null, then return null.
      if (documentElement === null) return null;

      // 2. Return the result of running locate a namespace on its document element using prefix.
      return locateNamespace(documentElement, prefix);
    }

    case node.DOCUMENT_TYPE_NODE:
    case node.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;

    case node.ATTRIBUTE_NODE: {
      const element = $(node as Attr).element;

      // 1. If its element is null, then return null.
      if (element === null) return null;

      // 2. Return the result of running locate a namespace on its element using prefix.
      return locateNamespace(element, prefix);
    }

    default: {
      const parentElement = getParentElement(node);

      // 1. If its parent element is null, then return null.
      if (parentElement === null) return null;

      // 2. Return the result of running locate a namespace on its parent element using prefix.
      return locateNamespace(parentElement, prefix);
    }
  }
}

function isXMLNamespace(
  { namespace, namespacePrefix, localName }: {
    namespace: unknown;
    namespacePrefix: unknown;
    localName: string;
  },
): boolean {
  return namespace === Namespace.XMLNS &&
    namespacePrefix === null &&
    localName === "xmlns";
}

export function equals(A: Node, B: Node): boolean {
  // A and B implement the same interfaces.
  if (A.nodeType !== B.nodeType) return false;

  // A and B have the same number of children.
  if (tree.children(A).size !== tree.children(B).size) return false;

  // The following are equal, switching on the interface A implements:
  if (!equalsInternalSlot(A, B)) return false;

  const pair = izip(tree.children(A), tree.children(B));

  // Each child of A equals the child of B at the identical index.
  return iter(pair).every(([left, right]) => equals(left, right));
}

export function equalsDocumentType(
  left: DocumentType,
  right: DocumentType,
): boolean {
  const _ = $(left), __ = $(right);

  return _.name === __.name &&
    _.publicId === __.publicId &&
    _.systemId === __.systemId;
}

export function equalsInternalSlot(
  left: Node,
  right: Node,
): boolean {
  switch (left.nodeType) {
    case left.DOCUMENT_TYPE_NODE:
      return equalsDocumentType(<DocumentType> left, <DocumentType> right);

    case left.ELEMENT_NODE:
      return equalsElement(<Element> left, <Element> right);
    case left.ATTRIBUTE_NODE:
      return equalsAttr(<Attr> left, <Attr> right);
    case left.PROCESSING_INSTRUCTION_NODE:
      return equalsProcessingInstruction(
        <ProcessingInstruction> left,
        <ProcessingInstruction> right,
      );
    case left.TEXT_NODE:
    case left.CDATA_SECTION_NODE:
    case left.COMMENT_NODE:
      return equalsCharacterData(<CharacterData> left, <CharacterData> right);
    default:
      return true;
  }
}

export function equalsElement(left: Element, right: Element): boolean {
  const _ = $(left), __ = $(right);

  return _.namespace === __.namespace &&
    _.namespacePrefix === __.namespacePrefix &&
    _.localName === __.localName &&
    _.attributeList.size === __.attributeList.size &&
    // each attribute in its attribute list has an attribute that equals an attribute in B’s attribute list.
    // TODO:(miyauci) improve performance. O(n²)
    iter(_.attributeList).every((left) =>
      iter(__.attributeList).some((right) => equalsAttr(left, right))
    );
}

export function equalsAttr(left: Attr, right: Attr): boolean {
  const _ = $(left), __ = $(right);

  // Its namespace, local name, and value.
  return left === right ||
    _.namespace === __.namespace &&
      _.localName === __.localName &&
      _.value === __.value;
}

export function equalsCharacterData(
  left: CharacterData,
  right: CharacterData,
): boolean {
  return $(left).data === $(right).data;
}

export function equalsProcessingInstruction(
  left: ProcessingInstruction,
  right: ProcessingInstruction,
): boolean {
  return equalsCharacterData(left, right) &&
    $(left).target === $(right).target;
}

/**
 * @see https://dom.spec.whatwg.org/#contiguous-text-nodes
 */
export function* contiguousTextNodesExclusive(
  node: Node,
): IterableIterator<Text> {
  const previousSibling = tree.previousSibling(node);

  if (previousSibling && isText(previousSibling)) yield previousSibling;
  const preceding = tree.precedeSiblings(node);

  const precedingTexts = takewhile(preceding, isText);
  const following = tree.followSiblings(node);
  const followingTexts = takewhile(following, isText);

  yield* [...precedingTexts].reverse();
  yield* followingTexts;
}
