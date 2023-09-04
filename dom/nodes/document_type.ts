import { Node, NodeStates, NodeType } from "./node.ts";
import { ChildNode } from "./node_trees/child_node.ts";
import { Document } from "./documents/document.ts";
import { $nodeDocument } from "./internal.ts";
import type { IDocumentType } from "../../interface.d.ts";
import type { PartialBy } from "../../deps.ts";

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
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-name)
   */
  protected readonly _name: string;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-publicid)
   */
  protected readonly _publicId: string;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-systemid)
   */
  protected readonly _systemId: string;

  constructor(
    { name, publicId = "", systemId = "", nodeDocument }:
      & PartialBy<DocumentTypeStates, Optional>
      & NodeStates,
  ) {
    super();

    this._name = name;
    this._publicId = publicId;
    this._systemId = systemId;
    this[$nodeDocument] = nodeDocument;
  }

  override [$nodeDocument]: Document;

  override get nodeType(): NodeType.DOCUMENT_TYPE_NODE {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  override get nodeName(): string {
    return this._name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(_: unknown) {
    // noop
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(_: unknown) {
    // noop
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  protected override clone(document: Document): DocumentType {
    return new DocumentType(
      {
        name: this._name,
        publicId: this._publicId,
        systemId: this._systemId,
        nodeDocument: document,
      },
    );
  }

  get name(): string {
    return this._name;
  }

  get publicId(): string {
    return this._publicId;
  }

  get systemId(): string {
    return this._systemId;
  }
}

// deno-lint-ignore no-empty-interface
export interface DocumentType extends ChildNode {}
