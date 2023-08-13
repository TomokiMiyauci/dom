import { Element } from "./element.ts";
import { type Node } from "./node.ts";
import { Public } from "../deps.ts";
import { descendant } from "../trees/tree.ts";
import { isElement } from "./utils.ts";
import type { INonElementParentNode } from "../interface.d.ts";

export function NonElementParentNode<
  // deno-lint-ignore no-explicit-any
  T extends new (...args: any[]) => Public<Node>,
>(Ctor: T) {
  return class extends Ctor implements NonElementParentNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid
     */
    getElementById(elementId: string): Element | null {
      // return the first element, in tree order, within this’s descendants, whose ID is elementId; otherwise, if there is no such element, null.
      for (const node of descendant(this)) {
        if (isElement(node) && node._ID === elementId) return node;
      }

      return null;
    }
  };
}

/**
 * @see https://dom.spec.whatwg.org/#interface-nonelementparentnode
 */
// deno-lint-ignore no-empty-interface
export interface NonElementParentNode extends INonElementParentNode {}
