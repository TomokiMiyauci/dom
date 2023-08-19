import { isDocument, isElement, UnImplemented } from "./utils.ts";
import type { ChildNode } from "./child_node.ts";
import { NodeList, NodeListOf } from "./node_list.ts";
import { type Document } from "./document.ts";
import type { INode } from "../interface.d.ts";
import { appendNode, preInsertNode, preRemoveChild } from "./mutation.ts";
import { HTMLCollection } from "./html_collection.ts";
import { getRoot, Tree, Treeable } from "../trees/tree.ts";
import { Namespace } from "../infra/namespace.ts";
import { $namespace, $nodeDocument } from "./internal.ts";
import { every, izip } from "../deps.ts";
import { type OrderedSet } from "../infra/set.ts";

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

export interface NodeStates {
  nodeDocument: Document;
}

@Treeable
export abstract class Node extends EventTarget implements INode {
  static DOCUMENT_POSITION_DISCONNECTED = 0x01 as const;
  static DOCUMENT_POSITION_PRECEDING = 0x02 as const;
  static DOCUMENT_POSITION_FOLLOWING = 0x04 as const;
  static DOCUMENT_POSITION_CONTAINS = 0x08 as const;
  static DOCUMENT_POSITION_CONTAINED_BY = 0x10 as const;
  static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20 as const;

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

  abstract [$nodeDocument]: Document;

  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

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

  get childNodes(): NodeListOf<Node & ChildNode> {
    return new NodeList({
      root: this,
      filter: (node) => this._children.contains(node),
    }) as any as NodeListOf<
      Node & ChildNode
    >;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-firstchild
   */
  get firstChild(): (ChildNode & Node) | null {
    // return this’s first child.
    return this._firstChild;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lastchild
   */
  get lastChild(): (Node & ChildNode) | null {
    // return this’s last child.
    return this._lastChild;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-previoussibling
   */
  get previousSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    if (this._parent) {
      const index = [...this._parent._children].indexOf(this);
      if (index > 0) return this._parent._children[index - 1];
    }

    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nextsibling
   */
  get nextSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    if (this._parent) {
      const index = [...this._parent._children].indexOf(this);
      if (index > -1) return this._parent._children[index + 1];
    }

    return null;
  }

  normalize(): void {
    throw new UnImplemented("normalize");
  }

  cloneNode(deep?: boolean | undefined): Node {
    let document = this[$nodeDocument];
    const copy = this.clone(document);

    if (isDocument(copy)) document = copy;

    if (deep) {
      for (const child of copy._children) {
        appendNode(this.clone.call(child, document), copy);
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
      otherNode.constructor === this.constructor &&
      this.equals(otherNode as this) &&
      this._children.size === otherNode._children.size &&
      every(
        izip(this._children, otherNode._children),
        ([left, right]) => this.isEqualNode.call(left, right),
      ));
  }

  isSameNode(otherNode: Node | null): boolean {
    throw new UnImplemented("isSameNode");
  }

  get DOCUMENT_POSITION_DISCONNECTED(): 1 {
    return 1;
  }

  get DOCUMENT_POSITION_PRECEDING(): 2 {
    return 2;
  }

  get DOCUMENT_POSITION_FOLLOWING(): 4 {
    return 4;
  }

  get DOCUMENT_POSITION_CONTAINS(): 8 {
    return 8;
  }

  get DOCUMENT_NODE(): 9 {
    return 9;
  }

  get DOCUMENT_TYPE_NODE(): 10 {
    return 10;
  }

  get DOCUMENT_FRAGMENT_NODE(): 11 {
    return 11;
  }

  get DOCUMENT_POSITION_CONTAINED_BY(): 16 {
    return 16;
  }

  get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): 32 {
    return 32;
  }

  get ELEMENT_NODE(): 1 {
    return 1;
  }

  get ENTITY_NODE(): 6 {
    return 6;
  }

  get ATTRIBUTE_NODE(): 2 {
    return 2;
  }

  get TEXT_NODE(): 3 {
    return 3;
  }

  get CDATA_SECTION_NODE(): 4 {
    return 4;
  }

  get ENTITY_REFERENCE_NODE(): 5 {
    return 5;
  }

  get COMMENT_NODE(): 8 {
    return 8;
  }

  get PROCESSING_INSTRUCTION_NODE(): 7 {
    return 7;
  }

  get NOTATION_NODE(): 12 {
    return 12;
  }

  compareDocumentPosition(other: Node): number {
    throw new UnImplemented();
  }

  contains(other: Node | null): boolean {
    throw new UnImplemented("contains");
  }

  lookupPrefix(namespace: string | null): string | null {
    throw new UnImplemented("lookupPrefix");
  }

  lookupNamespaceURI(prefix: string | null): string | null {
    throw new UnImplemented("lookupNamespaceURI");
  }

  isDefaultNamespace(namespace: string | null): boolean {
    throw new UnImplemented("isDefaultNamespace");
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

export interface Node extends Tree {
  _parent: Node | null;
  _children: OrderedSet<Node>;
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
            element._qualifiedName === qualifiedName.toLowerCase()) ||
        // - Whose namespace is not the HTML namespace and whose qualified name is qualifiedName.
        (element[$namespace] !== Namespace.HTML &&
          element._qualifiedName === qualifiedName),
    });
  }

  // 3. Otherwise, return an HTMLCollection rooted at root, whose filter matches descendant elements whose qualified name is qualifiedName.
  return new HTMLCollection({
    root,
    filter: (element) =>
      element !== root && element._qualifiedName === qualifiedName,
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 */
export function getElementsByClassName(
  classNames: string,
  root: Node,
): HTMLCollection {
  throw new Error("getElementsByClassName");
}

/**
 * @see https://dom.spec.whatwg.org/#parent-element
 */
export function getParentElement(node: Node): Element | null {
  const parent = node._parent;

  // If the node has a parent of a different type, its parent element is null.
  return parent && isElement(parent) ? parent : null;
}
