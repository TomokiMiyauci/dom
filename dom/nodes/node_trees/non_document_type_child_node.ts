import { type INonDocumentTypeChildNode } from "../../../interface.d.ts";
import { isElement } from "../utils.ts";
import type { Element } from "../elements/element.ts";
import { type Constructor, find, first, ifilter } from "../../../deps.ts";
import { type Node } from "../node.ts";
import {
  getFollowingSiblings,
  getPrecedingSiblings,
} from "../../trees/tree.ts";

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

      return first(precedeElementSiblings) ?? null;
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-nondocumenttypechildnode-nextelementsibling
     */
    get nextElementSibling(): Element | null {
      // return the first following sibling that is an element; otherwise null.
      const followingSiblings = getFollowingSiblings(this);

      return (find(followingSiblings, isElement) as Element) ?? null;
    }
  }

  return NonDocumentTypeChildNode;
}

// deno-lint-ignore no-empty-interface
export interface NonDocumentTypeChildNode extends INonDocumentTypeChildNode {}
