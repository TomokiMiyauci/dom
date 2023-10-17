import { Node, NodeType } from "./node.ts";
import type { IDocumentFragment } from "../interface.d.ts";
import { replaceAllString } from "./utils/replace_all_string.ts";
import { $, tree } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { host, nodeDocument } from "../symbol.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#documentfragment)
 */

@Exposed("Window", "DocumentFragment")
export class DocumentFragment extends Node implements IDocumentFragment {
  /**
   * @see https://dom.spec.whatwg.org/#dom-documentfragment-documentfragment
   */
  constructor() {
    super();

    // set this’s node document to current global object’s associated Document.
    this[nodeDocument] = globalThis.document;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.DOCUMENT_FRAGMENT_NODE {
    return NodeType.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodename
   */
  override get nodeName(): "#document-fragment" {
    return "#document-fragment";
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
  override get textContent(): string {
    return tree.descendantTextContent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    value ??= "";
    value = String(value); // TODO DOMString setter

    // String replace all with the given value within this.
    replaceAllString(value, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[nodeDocument];
  }

  protected override clone(document: Document): globalThis.DocumentFragment {
    const fragment = new DocumentFragment();
    fragment[nodeDocument] = document;

    return fragment;
  }

  get #_() {
    return $<DocumentFragment>(this);
  }

  [host]: Element | null = null;
}

export interface DocumentFragment {
  getElementById(elementId: string): HTMLElement | null;
}
