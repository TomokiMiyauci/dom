import { Node, NodeType } from "./node.ts";
import { ParentNode } from "./node_trees/parent_node.ts";
import { NonElementParentNode } from "./node_trees/non_element_parent_node.ts";
import type { IDocumentFragment } from "../../interface.d.ts";
import { replaceAllString } from "./utils/replace_all_string.ts";
import { $, internalSlots, tree } from "../../internal.ts";

@ParentNode
@NonElementParentNode
/**
 * @see https://dom.spec.whatwg.org/#interface-documentfragment
 */
export class DocumentFragment extends Node implements IDocumentFragment {
  /**
   * @see https://dom.spec.whatwg.org/#dom-documentfragment-documentfragment
   */
  constructor() {
    // set this’s node document to current global object’s associated Document.
    super(globalThis.document);

    const _ = Object.assign(this._, new DocumentFragmentInternals());
    this._ = _;

    internalSlots.set(this, _);
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
    return this._.nodeDocument;
  }

  protected override clone(document: Document): globalThis.DocumentFragment {
    const fragment = new DocumentFragment();
    $(fragment).nodeDocument = document;

    return fragment;
  }

  declare protected _: DocumentFragmentInternals & Node["_"];
}

export interface DocumentFragment extends ParentNode, NonElementParentNode {
  getElementById(elementId: string): HTMLElement | null;
}

export class DocumentFragmentInternals {
  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-documentfragment-host)
   */
  host: Element | null = null;
}
