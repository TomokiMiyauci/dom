import { Node, NodeType } from "./node.ts";
import type { IDocumentType } from "../../interface.d.ts";
import { $, internalSlots } from "../../internal.ts";

export class DocumentType extends Node implements IDocumentType {
  constructor() {
    super();

    const internal = new DocumentTypeInternals();
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
    const doctype = new DocumentType();

    $(doctype).name = this.#_.name,
      $(doctype).publicId = this.#_.publicId,
      $(doctype).systemId = this.#_.systemId,
      $(doctype).nodeDocument = document;

    return doctype;
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

export class DocumentTypeInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-name)
   */
  name!: string;

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
}
