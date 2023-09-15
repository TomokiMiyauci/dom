import { type INonDocumentTypeChildNode } from "../../../interface.d.ts";
import { isElement } from "../utils.ts";
import { type Constructor, iter } from "../../../deps.ts";
import { tree } from "../../../internal.ts";

export function NonDocumentTypeChildNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class NonDocumentTypeChildNode extends Ctor
    implements INonDocumentTypeChildNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-nondocumenttypechildnode-previouselementsibling
     */
    get previousElementSibling(): Element | null {
      // return the first preceding sibling that is an element; otherwise null.
      const precedeSiblings = tree.precedeSiblings(this);

      return iter(precedeSiblings).find(isElement) ?? null;
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-nondocumenttypechildnode-nextelementsibling
     */
    get nextElementSibling(): Element | null {
      // return the first following sibling that is an element; otherwise null.
      const followingSiblings = tree.followSiblings(this);

      return iter(followingSiblings).find(isElement) ?? null;
    }
  }

  return NonDocumentTypeChildNode;
}

// deno-lint-ignore no-empty-interface
export interface NonDocumentTypeChildNode extends INonDocumentTypeChildNode {}
