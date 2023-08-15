import { Node, NodeStates, NodeType } from "./node.ts";
import { ChildNode } from "./child_node.ts";
import { Document } from "./document.ts";
import { UnImplemented } from "./utils.ts";
import { $nodeDocument } from "./internal.ts";
import type { IDocumentType } from "../interface.d.ts";
import type { PartialBy } from "../deps.ts";

export interface DocumentTypeStates {
  name: string;

  /**
   * @default ""
   */
  publicId: string;

  /**
   * @default ""
   */
  systemId: string;
}

type Optional = "publicId" | "systemId";

@ChildNode
export class DocumentType extends Node implements IDocumentType {
  readonly #name: string;
  readonly #publicId: string;
  readonly #systemId: string;

  constructor(
    { name, publicId = "", systemId = "", nodeDocument }:
      & PartialBy<DocumentTypeStates, Optional>
      & NodeStates,
  ) {
    super();

    this.#name = name;
    this.#publicId = publicId;
    this.#systemId = systemId;
    this[$nodeDocument] = nodeDocument;
  }

  override [$nodeDocument]: Document;

  override get nodeType(): NodeType.DOCUMENT_TYPE_NODE {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  override get nodeName(): string {
    return this.#name;
  }

  override get nodeValue(): null {
    return null;
  }

  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): null {
    return null;
  }

  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  protected override clone(document: Document): DocumentType {
    return new DocumentType(
      {
        name: this.#name,
        publicId: this.#publicId,
        systemId: this.#systemId,
        nodeDocument: document,
      },
    );
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
