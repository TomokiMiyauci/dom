import { isElement } from "./utils/type.ts";
import type { INonElementParentNode } from "./../interface.d.ts";
import { convert, DOMString } from "./../_internals/webidl/types.ts";
import { $, tree } from "./../internal.ts";

export class NonElementParentNode implements INonElementParentNode {
  /**
   * @see https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid
   */
  @convert
  getElementById(@DOMString elementId: string): Element | null {
    // return the first element, in tree order, within this’s descendants, whose ID is elementId; otherwise, if there is no such element, null.
    for (const node of tree.descendants(this)) {
      if (isElement(node) && $(node).ID === elementId) return node;
    }

    return null;
  }
}

/**
 * @see https://dom.spec.whatwg.org/#interface-nonelementparentnode
 */
export interface NonElementParentNode extends Node {}
