import { Node, NodeType } from "./node.ts";
import { ChildNode } from "./child_node.ts";
import { UnImplemented } from "./utils.ts";
import type { IDocumentType } from "../interface.d.ts";

export class DocumentType extends Node implements IDocumentType {
  #name: string;
  #publicId: string;
  #systemId: string;

  constructor(name: string, publicId: string, systemId: string) {
    super();

    this.#name = name;
    this.#publicId = publicId;
    this.#systemId = systemId;
  }

  get ownerDocument(): any {
    throw new UnImplemented();
  }

  override get nodeType(): NodeType.DOCUMENT_TYPE_NODE {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  override get nodeName(): string {
    throw new UnImplemented();
  }

  override get nodeValue(): string | null {
    throw new UnImplemented();
  }
  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  override get textContent(): string | null {
    throw new UnImplemented();
  }
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  get name(): string {
    return this.#name;
  }

  get publicId(): string {
    return this.#publicId;
  }

  get systemId(): string {
    return this.#systemId;
  }
}

export interface DocumentType extends ChildNode {}
