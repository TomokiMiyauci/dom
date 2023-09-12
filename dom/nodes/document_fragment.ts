import { Node, NodeStates, NodeType } from "./node.ts";
import { ParentNode } from "./node_trees/parent_node.ts";
import { type Document } from "./documents/document.ts";
import { type Element } from "./elements/element.ts";
import { NonElementParentNode } from "./node_trees/non_element_parent_node.ts";
import type { IDocumentFragment } from "../../interface.d.ts";
import { $nodeDocument } from "./internal.ts";
import { descendantTextContent } from "./text.ts";
import { replaceAllString } from "./elements/element.ts";
import { internalSlots } from "../../internal.ts";

@ParentNode
@NonElementParentNode
/**
 * @see https://dom.spec.whatwg.org/#interface-documentfragment
 */
export class DocumentFragment extends Node implements IDocumentFragment {
  override [$nodeDocument]!: Document;

  /**
   * @see https://dom.spec.whatwg.org/#dom-documentfragment-documentfragment
   */
  constructor() {
    super();

    // set this’s node document to current global object’s associated Document.
    this[$nodeDocument] = globalThis.document as Document;

    internalSlots.set(this, new DocumentFragmentInternals());
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
    return descendantTextContent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    value ??= "";

    // String replace all with the given value within this.
    replaceAllString(value, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  protected override clone(document: Document): DocumentFragment {
    return DocumentFragment.create({ nodeDocument: document });
  }

  private static create(states: NodeStates): DocumentFragment {
    const node = new DocumentFragment();
    node[$nodeDocument] = states.nodeDocument;

    return node;
  }
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
