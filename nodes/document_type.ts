import { Node, NodeType } from "./node.ts";
import type { IDocumentType } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { name, nodeDocument, publicId, systemId } from "../symbol.ts";
import type { DocumentTypeInternals } from "../i.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#documenttype)
 */
@Exposed("Window", "DocumentType")
export class DocumentType extends Node
  implements IDocumentType, DocumentTypeInternals {
  protected constructor() {
    super();
  }

  override get nodeType(): NodeType.DOCUMENT_TYPE_NODE {
    return NodeType.DOCUMENT_TYPE_NODE;
  }

  override get nodeName(): string {
    return this[name];
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
    return this[nodeDocument];
  }

  protected override clone(document: Document): DocumentType {
    const doctype = new DocumentType();

    doctype[name] = this[name],
      doctype[publicId] = this[publicId],
      doctype[systemId] = this[systemId];
    doctype[nodeDocument] = document;

    return doctype;
  }

  get name(): string {
    return this[name];
  }

  get publicId(): string {
    return this[publicId];
  }

  get systemId(): string {
    return this[systemId];
  }

  get #_() {
    return $<DocumentType>(this);
  }

  /**
   * @remarks Set after creation
   */
  [name]!: string;
  [publicId] = "";
  [systemId] = "";
}
