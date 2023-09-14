import { Constructor } from "../../../deps.ts";
import { isElement } from "../utils.ts";
import type { INonElementParentNode } from "../../../interface.d.ts";
import { convert, DOMString } from "../../../webidl/types.ts";
import { $, tree } from "../../../internal.ts";

export function NonElementParentNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class Mixin extends Ctor implements NonElementParentNode {
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

  return Mixin;
}

/**
 * @see https://dom.spec.whatwg.org/#interface-nonelementparentnode
 */
// deno-lint-ignore no-empty-interface
export interface NonElementParentNode extends INonElementParentNode {}
