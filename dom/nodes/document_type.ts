import { Node, NodeType } from "./node.ts";
import { ChildNode } from "./node_trees/child_node.ts";
import type { IDocumentType } from "../../interface.d.ts";
import type { PartialBy } from "../../deps.ts";
import { $, internalSlots } from "../../internal.ts";
import { includes } from "../../utils.ts";

type Optional = "publicId" | "systemId";

export class DocumentType extends Node implements IDocumentType {
  constructor(
    { name, publicId = "", systemId = "", nodeDocument }:
      & PartialBy<
        Pick<
          DocumentTypeInternals,
          "name" | "publicId" | "systemId"
        >,
        Optional
      >
      & { nodeDocument: Document },
  ) {
    super(nodeDocument);

    const internal = new DocumentTypeInternals({ name });
    internal.publicId = publicId, internal.systemId = systemId;
    internalSlots.extends<DocumentType>(this, internal);
  }

  override get nodeType(): NodeType.DOCUMENT_TYPE_NODE {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  override get nodeName(): string {
    return this.#_.name;
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
    return this.#_.nodeDocument;
  }

  protected override clone(document: Document): DocumentType {
    return new DocumentType(
      {
        name: this.#_.name,
        publicId: this.#_.publicId,
        systemId: this.#_.systemId,
        nodeDocument: document,
      },
    );
  }

  get name(): string {
    return this.#_.name;
  }

  get publicId(): string {
    return this.#_.publicId;
  }

  get systemId(): string {
    return this.#_.systemId;
  }

  get #_() {
    return $<DocumentType>(this);
  }
}

includes(DocumentType, ChildNode());

// deno-lint-ignore no-empty-interface
export interface DocumentType extends ChildNode {}

export class DocumentTypeInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-name)
   */
  name: string;

  /**
   * @default ""
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-publicid)
   */
  publicId = "";

  /**
   * @default ""
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-systemid)
   */
  systemId = "";

  constructor(
    { name }: Pick<DocumentTypeInternals, "name">,
  ) {
    this.name = name;
  }
}
