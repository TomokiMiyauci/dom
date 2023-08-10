import { UnImplemented } from "./utils.ts";
import type { ChildNode } from "./child_node.ts";
import type { ParentNode } from "./parent_node.ts";
import type { HTMLElement } from "./html_element.ts";
import type { Document } from "./document.ts";
import type { INode } from "../interface.d.ts";

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

export abstract class Node extends EventTarget implements INode {
  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  get baseURI(): string {
    throw new UnImplemented();
  }

  get isConnected(): boolean {
    throw new UnImplemented();
  }

  get ownerDocument(): any | null {
    throw new UnImplemented();
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

  get childNodes(): any {
    throw new UnImplemented();
  }

  get firstChild(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  get lastChild(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  get previousSibling(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  get nextSibling(): (Node & ChildNode) | null {
    throw new UnImplemented();
  }

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

  normalize(): void {}

  cloneNode(deep?: boolean | undefined): Node {
    throw new UnImplemented();
  }

  abstract isEqualNode(otherNode: Node | null): boolean;

  isSameNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  readonly DOCUMENT_POSITION_DISCONNECTED = 1;
  readonly DOCUMENT_POSITION_PRECEDING = 2;
  readonly DOCUMENT_POSITION_FOLLOWING = 4;
  readonly DOCUMENT_POSITION_CONTAINS = 8;
  readonly DOCUMENT_NODE = 9;
  readonly DOCUMENT_TYPE_NODE = 10;
  readonly DOCUMENT_FRAGMENT_NODE = 11;
  readonly DOCUMENT_POSITION_CONTAINED_BY = 16;
  readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

  readonly ELEMENT_NODE = 1;
  readonly ENTITY_NODE = 6;

  readonly ATTRIBUTE_NODE = 2;
  readonly TEXT_NODE = 3;
  readonly CDATA_SECTION_NODE = 4;
  readonly ENTITY_REFERENCE_NODE = 5;
  readonly COMMENT_NODE = 8;
  readonly PROCESSING_INSTRUCTION_NODE = 7;
  readonly NOTATION_NODE = 12;

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
    throw new UnImplemented();
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
