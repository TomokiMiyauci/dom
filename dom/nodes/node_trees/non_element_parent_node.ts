import { Element } from "../elements/element.ts";
import { type Node } from "../node.ts";
import { Constructor } from "../../../deps.ts";
import { getDescendants } from "../../infra/tree.ts";
import { isElement } from "../utils.ts";
import type { INonElementParentNode } from "../../../interface.d.ts";
import { convert, DOMString } from "../../../webidl/types.ts";

export function NonElementParentNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class Mixin extends Ctor implements NonElementParentNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid
     */
    @convert
    getElementById(@DOMString elementId: string): Element | null {
      // return the first element, in tree order, within this’s descendants, whose ID is elementId; otherwise, if there is no such element, null.
      for (const node of getDescendants(this) as Iterable<Node>) {
        if (isElement(node) && node["_ID"] === elementId) return node;
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
