import { UnImplemented } from "./utils.ts";
import type { ChildNode } from "./child_node.ts";
import { NodeList, NodeListOf } from "./node_list.ts";
import { type Document } from "./document.ts";
import { Text } from "./text.ts";
import type { INode } from "../interface.d.ts";
import { appendNode, replaceNode } from "./mutation.ts";
import { HTMLCollection } from "./html_collection.ts";
import { Tree, Treeable } from "../trees/tree.ts";
import { Namespace } from "../infra/namespace.ts";

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

@Treeable
export abstract class Node extends EventTarget implements INode {
  abstract nodeDocument: Document;

  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

  get index(): number {
    return 0;
  }

  get baseURI(): string {
    throw new UnImplemented();
  }

  get isConnected(): boolean {
    throw new UnImplemented();
  }

  get ownerDocument(): Document | null {
    return this.nodeDocument;
  }

  getRootNode(options?: GetRootNodeOptions | undefined): Node {
    throw new UnImplemented();
  }

  get parentNode(): (Node & ParentNode) | null {
    throw new UnImplemented();
  }

  hasChildNodes(): boolean {
    throw new UnImplemented();
  }

  get childNodes(): NodeListOf<Node & ChildNode> {
    return new NodeList(this) as never as NodeListOf<Node & ChildNode>;
  }

  get firstChild(): (Node & ChildNode) | null {
    return this._firstChild;
  }

  get lastChild(): (Node & ChildNode) | null {
    return this._lastChild;
  }

  get previousSibling(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  get nextSibling(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  normalize(): void {}

  cloneNode(deep?: boolean | undefined): Node {
    throw new UnImplemented();
  }

  abstract isEqualNode(otherNode: Node | null): boolean;

  isSameNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
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
    throw new UnImplemented();
  }

  lookupPrefix(namespace: string | null): string | null {
    throw new UnImplemented();
  }

  lookupNamespaceURI(prefix: string | null): string | null {
    throw new UnImplemented();
  }

  isDefaultNamespace(namespace: string | null): boolean {
    throw new UnImplemented();
  }

  insertBefore<T extends Node>(node: T, child: Node | null): T {
    throw new UnImplemented();
  }

  appendChild<T extends Node>(node: T): T {
    return appendNode(node, this);
  }

  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new UnImplemented();
  }

  removeChild<T extends Node>(child: T): T {
    throw new UnImplemented();
  }

  get parentElement(): any | null {
    throw new UnImplemented();
  }
}

export interface Node extends Tree {}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
 */
export function getElementsByQualifiedName(
  qualifiedName: string,
  root: Node,
): HTMLCollection {
  // 1. If qualifiedName is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches only descendant elements.
  if (qualifiedName === "*") {
    return new HTMLCollection(root, (node) => node !== root);
  }

  // 2. Otherwise, if root’s node document is an HTML document, return an HTMLCollection rooted at root, whose filter matches the following descendant elements:
  if (root.nodeDocument._type !== "xml") {
    return new HTMLCollection(root, (element) =>
      element !== root &&
        // - Whose namespace is the HTML namespace and whose qualified name is qualifiedName, in ASCII lowercase.
        (element._namespace === Namespace.HTML &&
          element._qualifiedName === qualifiedName.toLowerCase()) ||
      // - Whose namespace is not the HTML namespace and whose qualified name is qualifiedName.
      (element._namespace !== Namespace.HTML &&
        element._qualifiedName === qualifiedName));
  }

  // 3. Otherwise, return an HTMLCollection rooted at root, whose filter matches descendant elements whose qualified name is qualifiedName.
  return new HTMLCollection(
    root,
    (element) => element !== root && element._qualifiedName === qualifiedName,
  );
}

/**
 * @see https://dom.spec.whatwg.org/#string-replace-all
 */
export function replaceAllString(string: string, parent: Node): void {
  // 1. Let node be null.
  let node = null;

  // 2. If string is not the empty string, then set node to a new Text node whose data is string and node document is parent’s node document.
  if (string !== "") node = new Text(string, parent.nodeDocument);

  // 3. Replace all with node within parent.
  replaceNode(node, parent);
}
