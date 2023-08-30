import { type INonDocumentTypeChildNode } from "../interface.d.ts";
import { isElement } from "./utils.ts";
import type { Element } from "./element.ts";
import { type Constructor, ifilter, last } from "../deps.ts";
import { type Node } from "./node.ts";
import { getPrecedingSiblings } from "../trees/tree.ts";

export function NonDocumentTypeChildNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class NonDocumentTypeChildNode extends Ctor
    implements INonDocumentTypeChildNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-nondocumenttypechildnode-previouselementsibling
     */
    get previousElementSibling(): Element | null {
      // return the first preceding sibling that is an element; otherwise null.
      const precedeSiblings = getPrecedingSiblings(this);
      const precedeElementSiblings = ifilter(precedeSiblings, isElement);

      return last(precedeElementSiblings) ?? null;
    }

    get nextElementSibling(): Element | null {
      throw new Error("nextElementSibling");
    }
  }

  return NonDocumentTypeChildNode;
}

// deno-lint-ignore no-empty-interface
export interface NonDocumentTypeChildNode extends INonDocumentTypeChildNode {}
