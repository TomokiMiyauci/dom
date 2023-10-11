import { type INonDocumentTypeChildNode } from "../../interface.d.ts";
import { isElement } from "../utils/type.ts";
import { iter } from "../../deps.ts";
import { tree } from "../../internal.ts";

export class NonDocumentTypeChildNode implements INonDocumentTypeChildNode {
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

export interface NonDocumentTypeChildNode extends Node {}
