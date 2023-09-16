import type { INodeIterator } from "../../interface.d.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { $, tree } from "../../internal.ts";
import { Direction, traverse } from "./node_iterator_utils.ts";

@Exposed(Window)
export class NodeIterator implements INodeIterator {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this.#_.root;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-referencenode)
   */
  get referenceNode(): Node {
    // return this’s reference.
    return this.#_.reference;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-pointerbeforereferencenode)
   */
  get pointerBeforeReferenceNode(): boolean {
    // return this’s pointer before reference.
    return this.#_.pointerBeforeReference;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this.#_.whatToShow;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-filter)
   */
  get filter(): NodeFilter | null {
    return this.#_.filter;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-nextnode)
   */
  nextNode(): Node | null {
    // return the result of traversing with this and next.
    return traverse(this, Direction.Next);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-previousnode)
   */
  previousNode(): Node | null {
    // return the result of traversing with this and previous.
    return traverse(this, Direction.Previous);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-detach)
   */
  detach(): void {
    // do nothing.
  }

  // It does not seem to be defined in the specification. For test pass.
  [Symbol.toStringTag] = "NodeIterator";

  get #_(): NodeIteratorInternals {
    return $(this);
  }
}

export class NodeIteratorInternals {
  /**
   * @default false
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  activeFlag = false;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-root)
   */
  root: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-whattoshow)
   */
  whatToShow: number;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-filter)
   */
  filter: NodeFilter | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#iterator-collection)
   */
  get iteratorCollection(): IterableIterator<Node> {
    return tree.inclusiveDescendants(this.root);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-reference)
   */
  reference: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pointer-before-reference)
   */
  pointerBeforeReference: boolean;

  constructor(
    { reference, pointerBeforeReference, filter, whatToShow, root }: {
      reference: Node;
      pointerBeforeReference: boolean;
      filter: NodeFilter | null;
      whatToShow: number;
      root: Node;
    },
  ) {
    this.reference = reference;
    this.pointerBeforeReference = pointerBeforeReference;
    this.filter = filter;
    this.whatToShow = whatToShow;
    this.root = root;
  }
}
