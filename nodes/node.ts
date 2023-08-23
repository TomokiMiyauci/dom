import {
  getQualifiedName,
  isDocument,
  isElement,
  UnImplemented,
} from "./utils.ts";
import type { ChildNode } from "./child_node.ts";
import { NodeList, NodeListOf } from "./node_list.ts";
import { type Document } from "./document.ts";
import type { INode } from "../interface.d.ts";
import { appendNode, preInsertNode, preRemoveChild } from "./mutation.ts";
import { HTMLCollection } from "./html_collection.ts";
import {
  getFirstChild,
  getLastChild,
  getNextSibling,
  getPreviousSibling,
  getRoot,
} from "../trees/tree.ts";
import { Namespace } from "../infra/namespace.ts";
import {
  $attributeList,
  $element,
  $localName,
  $mode,
  $namespace,
  $namespacePrefix,
  $nodeDocument,
  $value,
} from "./internal.ts";
import { every, find, html, izip, some } from "../deps.ts";
import { OrderedSet } from "../infra/data_structures/set.ts";
import { matchASCIICaseInsensitive } from "../infra/string.ts";
import { parseOrderSet } from "../trees/ordered_set.ts";
import type { ParentNode } from "./parent_node.ts";
import { SameObject } from "../webidl/extended_attribute.ts";
import { getDocumentElement } from "./document_tree.ts";
import { type Attr } from "./attr.ts";
import { type Element } from "./element.ts";

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
}

enum Position {
  DOCUMENT_POSITION_DISCONNECTED = 1,
  DOCUMENT_POSITION_PRECEDING = 2,
  DOCUMENT_POSITION_FOLLOWING = 4,
  DOCUMENT_POSITION_CONTAINS = 8,
  DOCUMENT_POSITION_CONTAINED_BY = 16,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32,
}

export interface NodeStates {
  nodeDocument: Document;
}

export abstract class Node extends EventTarget implements INode {
  static DOCUMENT_POSITION_DISCONNECTED =
    Position.DOCUMENT_POSITION_DISCONNECTED;
  static DOCUMENT_POSITION_PRECEDING = Position.DOCUMENT_POSITION_PRECEDING;
  static DOCUMENT_POSITION_FOLLOWING = Position.DOCUMENT_POSITION_FOLLOWING;
  static DOCUMENT_POSITION_CONTAINS = Position.DOCUMENT_POSITION_CONTAINS;
  static DOCUMENT_POSITION_CONTAINED_BY =
    Position.DOCUMENT_POSITION_CONTAINED_BY;
  static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
    Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  static ELEMENT_NODE = NodeType.ELEMENT_NODE;
  static ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE;
  static TEXT_NODE = NodeType.TEXT_NODE;
  static CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE;
  static ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE;
  static ENTITY_NODE = NodeType.ENTITY_NODE;
  static PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE;
  static COMMENT_NODE = NodeType.COMMENT_NODE;
  static DOCUMENT_NODE = NodeType.DOCUMENT_NODE;
  static DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE;
  static DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE;
  static NOTATION_NODE = NodeType.NOTATION_NODE;

  // Because it needs to be defined in prototype, use getter instead of data property.
  get DOCUMENT_POSITION_DISCONNECTED(): 1 {
    return Position.DOCUMENT_POSITION_DISCONNECTED;
  }

  get DOCUMENT_POSITION_PRECEDING(): 2 {
    return Position.DOCUMENT_POSITION_PRECEDING;
  }

  get DOCUMENT_POSITION_FOLLOWING(): 4 {
    return Position.DOCUMENT_POSITION_FOLLOWING;
  }

  get DOCUMENT_POSITION_CONTAINS(): 8 {
    return Position.DOCUMENT_POSITION_CONTAINS;
  }

  get DOCUMENT_NODE(): 9 {
    return NodeType.DOCUMENT_NODE;
  }

  get DOCUMENT_TYPE_NODE(): 10 {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  get DOCUMENT_FRAGMENT_NODE(): 11 {
    return NodeType.DOCUMENT_FRAGMENT_NODE;
  }

  get DOCUMENT_POSITION_CONTAINED_BY(): 16 {
    return Position.DOCUMENT_POSITION_CONTAINED_BY;
  }

  get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): 32 {
    return Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  }

  get ELEMENT_NODE(): 1 {
    return NodeType.ELEMENT_NODE;
  }

  get ENTITY_NODE(): 6 {
    return NodeType.ENTITY_NODE;
  }

  get ATTRIBUTE_NODE(): 2 {
    return NodeType.ATTRIBUTE_NODE;
  }

  get TEXT_NODE(): 3 {
    return NodeType.TEXT_NODE;
  }

  get CDATA_SECTION_NODE(): 4 {
    return NodeType.CDATA_SECTION_NODE;
  }

  get ENTITY_REFERENCE_NODE(): 5 {
    return NodeType.ENTITY_REFERENCE_NODE;
  }

  get COMMENT_NODE(): 8 {
    return NodeType.COMMENT_NODE;
  }

  get PROCESSING_INSTRUCTION_NODE(): 7 {
    return NodeType.PROCESSING_INSTRUCTION_NODE;
  }

  get NOTATION_NODE(): 12 {
    return NodeType.NOTATION_NODE;
  }

  abstract [$nodeDocument]: Document;

  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

  _parent: (Node & ParentNode) | null = null;
  _children: OrderedSet<Node & ChildNode> = new OrderedSet();

  get baseURI(): string {
    throw new UnImplemented("baseURI");
  }

  get isConnected(): boolean {
    throw new UnImplemented("isConnected");
  }

  abstract get ownerDocument(): Document | null;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
   */
  getRootNode(options?: GetRootNodeOptions | undefined): Node {
    // return this’s shadow-including root if options["composed"] is true; otherwise this’s root.
    if (options?.composed) {
      throw new Error("getRootNode is not supported composed");
    }

    return getRoot(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-parentnode
   */
  get parentNode(): (Node & ParentNode) | null {
    // return this’s parent.
    return this._parent;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-haschildnodes
   */
  hasChildNodes(): boolean {
    // return true if this has children; otherwise fals
    return !this._children.isEmpty;
  }

  @SameObject
  get childNodes(): NodeListOf<Node & ChildNode> {
    return new NodeList({
      root: this,
      filter: (node): node is Node => {
        return this._children.contains(node);
      },
    }) as any as NodeListOf<
      Node & ChildNode
    >;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-firstchild
   */
  get firstChild(): (Node & ChildNode) | null {
    // return this’s first child.
    return getFirstChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lastchild
   */
  get lastChild(): (Node & ChildNode) | null {
    // return this’s last child.
    return getLastChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-previoussibling
   */
  get previousSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    return getPreviousSibling(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nextsibling
   */
  get nextSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    return getNextSibling(this);
  }

  normalize(): void {
    throw new UnImplemented("normalize");
  }

  cloneNode(deep?: boolean | undefined): Node {
    let document = this[$nodeDocument];
    const copy = this.clone(document);

    if (isDocument(copy)) document = copy;

    if (deep) {
      for (const child of this._children) {
        appendNode(Node.prototype.cloneNode.call(child, deep), copy);
      }
    }

    return copy;
  }

  /** Clone instance.
   * This API is used by {@linkcode cloneNode}.
   * It is not public API, so should be mark private.
   */
  protected abstract clone(document: Document): Node;

  /** Equals to {@linkcode other} node.
   * This is used for {@linkcode isEqualNode}.
   */
  protected abstract equals(other: this): boolean;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isequalnode
   */
  isEqualNode(otherNode: Node | null): boolean {
    // @optimized
    // return true if otherNode is non-null and this equals otherNode; otherwise false.
    return this === otherNode || (otherNode !== null &&
      this.nodeType === otherNode.nodeType &&
      this.equals(otherNode as this) &&
      this._children.size === otherNode._children.size &&
      every(
        izip(this._children, otherNode._children),
        ([left, right]) => Node.prototype.isEqualNode.call(left, right),
      ));
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-issamenode
   */
  isSameNode(otherNode: Node | null): boolean {
    // return true if otherNode is this; otherwise false.
    return this === otherNode;
  }

  compareDocumentPosition(other: Node): number {
    throw new UnImplemented();
  }

  contains(other: Node | null): boolean {
    throw new UnImplemented("contains");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
   */
  lookupPrefix(namespace: string | null): string | null {
    // 1. If namespace is null or the empty string, then return null.
    if (!namespace) return null;

    // 2. Switch on the interface this implements:
    const element = getInterface(this, this.nodeType);

    if (element) return locateNamespacePrefix(element, namespace);

    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
   */
  lookupNamespaceURI(prefix: string | null): string | null {
    // 1. If prefix is the empty string, then set it to null.
    prefix ||= null;

    // 2. Return the result of running locate a namespace for this using prefix.
    return locateNamespace(this, prefix);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
   */
  isDefaultNamespace(namespace: string | null): boolean {
    // 1. If namespace is the empty string, then set it to null.
    namespace ||= null;

    // 2. Let defaultNamespace be the result of running locate a namespace for this using null.
    const defaultNamespace = locateNamespace(this, null);

    // 3. Return true if defaultNamespace is the same as namespace; otherwise false.
    return defaultNamespace === namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-insertbefore
   */
  insertBefore<T>(node: T & Node, child: Node | null): T {
    // return the result of pre-inserting node into this before child.
    return preInsertNode(node, this, child);
  }

  appendChild<T>(node: T & Node): T {
    return appendNode(node, this) as T;
  }

  replaceChild<T>(node: T & Node, child: T): T {
    throw new UnImplemented("replaceChild");
  }

  removeChild<T>(child: T & Node): T {
    return preRemoveChild(child, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-parentelement
   */
  get parentElement(): HTMLElement | null {
    return getParentElement(this) as HTMLElement | null; // The specification is `Element`
  }
}

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
  if (root[$nodeDocument]._type !== "xml") {
    return new HTMLCollection({
      root,
      filter: (element) =>
        element !== root &&
          // - Whose namespace is the HTML namespace and whose qualified name is qualifiedName, in ASCII lowercase.
          (element[$namespace] === Namespace.HTML &&
            getQualifiedName(element) === qualifiedName.toLowerCase()) ||
        // - Whose namespace is not the HTML namespace and whose qualified name is qualifiedName.
        (element[$namespace] !== Namespace.HTML &&
          getQualifiedName(element) === qualifiedName),
    });
  }

  // 3. Otherwise, return an HTMLCollection rooted at root, whose filter matches descendant elements whose qualified name is qualifiedName.
  return new HTMLCollection({
    root,
    filter: (element) =>
      element !== root && getQualifiedName(element) === qualifiedName,
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

  const match = root[$nodeDocument][$mode] === html.DOCUMENT_MODE.QUIRKS
    ? matchASCIICaseInsensitive
    : Object.is;

  return new HTMLCollection({
    root,
    filter: (node) => {
      if (node === root) return false;

      return every(classes, (left) => {
        for (const right of node.classList) if (match(left, right)) return true;

        return false;
      });
    },
  });
}

/**
 * @see https://dom.spec.whatwg.org/#parent-element
 */
export function getParentElement(node: Node): Element | null {
  const parent = node._parent;

  // If the node has a parent of a different type, its parent element is null.
  return parent && isElement(parent) ? parent : null;
}

function getInterface(node: Node, nodeType: NodeType): Element | null {
  switch (nodeType) {
    case NodeType.ELEMENT_NODE:
      // Return the result of locating a namespace prefix for it using namespace.
      return (node as Element);
    case NodeType.DOCUMENT_NODE:
      // Return the result of locating a namespace prefix for its document element, if its document element is non-null; otherwise null.
      return getDocumentElement(node);
    case NodeType.DOCUMENT_TYPE_NODE:
    case NodeType.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;
    case NodeType.ATTRIBUTE_NODE:
      // Return the result of locating a namespace prefix for its element, if its element is non-null; otherwise null.
      return (node as Attr)[$element];
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
  if (element[$namespace] === namespace && element[$namespacePrefix] !== null) {
    return element[$namespacePrefix];
  }

  // 2. If element has an attribute whose namespace prefix is "xmlns" and value is namespace, then return element’s first such attribute’s local name.
  const attribute = find(
    element[$attributeList],
    (attr) =>
      attr[$namespacePrefix] === Namespace.XMLNS && attr[$value] === namespace,
  );

  if (attribute) return attribute[$localName];

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
    case NodeType.ELEMENT_NODE: {
      // 1. If prefix is "xml", then return the XML namespace.
      if (prefix === "xml") return Namespace.XML;

      // 2. If prefix is "xmlns", then return the XMLNS namespace.
      if (prefix === "xmlns") return Namespace.XMLNS;

      const element = node as Element;
      const namespace = element[$namespace];

      // 3. If its namespace is non-null and its namespace prefix is prefix, then return namespace.
      if (namespace !== null && element[$namespacePrefix] === prefix) {
        return namespace;
      }

      const attrList = element[$attributeList];

      // 4. If it has an attribute whose namespace is the XMLNS namespace, namespace prefix is "xmlns", and local name is prefix,
      const hasAttr = find(
        attrList,
        (attr) =>
          attr[$namespace] === Namespace.XMLNS &&
          attr[$namespacePrefix] === "xmlns" &&
          attr[$localName] === prefix,
      );
      // or if prefix is null and it has an attribute whose namespace is the XMLNS namespace, namespace prefix is null, and local name is "xmlns",
      const attribute = hasAttr ?? prefix === null
        ? find(attrList, (attr) =>
          attr[$namespace] === Namespace.XMLNS &&
          attr[$namespacePrefix] === null &&
          attr[$localName] === "xmlns")
        : null;

      // then return its value if it is not the empty string, and null otherwise.
      if (attribute) return attribute[$value] || null;

      const parentElement = getParentElement(element);

      // 5. If its parent element is null, then return null.
      if (parentElement === null) return null;

      // 6. Return the result of running locate a namespace on its parent element using prefix.
      return locateNamespace(parentElement, prefix);
    }

    case NodeType.DOCUMENT_NODE: {
      const documentElement = getDocumentElement(node);
      // 1. If its document element is null, then return null.
      if (documentElement === null) return null;

      // 2. Return the result of running locate a namespace on its document element using prefix.
      return locateNamespace(documentElement, prefix);
    }

    case NodeType.DOCUMENT_TYPE_NODE:
    case NodeType.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;

    case NodeType.ATTRIBUTE_NODE: {
      const element = (node as Attr)[$element];

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
