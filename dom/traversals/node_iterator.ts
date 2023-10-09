import type { INodeIterator } from "../../interface.d.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { $, tree } from "../../internal.ts";
import { Direction, traverse } from "./node_iterator_utils.ts";
import { Steps } from "../infra/applicable.ts";
import { iter, last } from "../../deps.ts";
import { first } from "npm:itertools@2.1.2";

@Exposed("Window", "NodeIterator")
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

  get #_() {
    return $<NodeIterator>(this);
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
  iteratorCollection: Iterable<Node>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-reference)
   */
  reference: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pointer-before-reference)
   */
  pointerBeforeReference: boolean;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pre-removing-steps)
   */
  preRemovingSteps: Steps<
    [nodeIterator: globalThis.NodeIterator, toBeRemovedNode: Node]
  > = new Steps();

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
    this.iteratorCollection = {
      [Symbol.iterator]: () => {
        return tree.inclusiveDescendants(this.root);
      },
    };
    const steps = new Steps<[globalThis.NodeIterator, Node]>();

    steps.define((nodeIterator, toBeRemovedNode) => {
      // 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s reference, or toBeRemovedNode is nodeIterator’s root, then return.
      if (
        !tree.isInclusiveAncestor(toBeRemovedNode, $(nodeIterator).reference) ||
        toBeRemovedNode === $(nodeIterator).root
      ) return;

      // 2. If nodeIterator’s pointer before reference is true, then:
      if ($(nodeIterator).pointerBeforeReference) return;

      const { root } = $(nodeIterator);
      const follows = iter(tree.follows(toBeRemovedNode)).filter((node) =>
        tree.isInclusiveDescendant(node, root)
      ).filter((node) => !tree.isInclusiveDescendant(node, toBeRemovedNode));
      // 1. Let next be toBeRemovedNode’s first following node that is an inclusive descendant of nodeIterator’s root and is not an inclusive descendant of toBeRemovedNode, and null if there is no such node.
      const next = first(follows) ?? null;

      // 2. If next is non-null, then set nodeIterator’s reference to next and return.
      if (next) {
        $(nodeIterator).reference = next;
        return;
        // 3. Otherwise, set nodeIterator’s pointer before reference to false.
      } else $(nodeIterator).pointerBeforeReference = false;

      const previousSibling = tree.previousSibling(toBeRemovedNode);
      // 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if toBeRemovedNode’s previous sibling is null, and to the inclusive descendant of toBeRemovedNode’s previous sibling that appears last in tree order otherwise.
      $(nodeIterator).reference = previousSibling === null
        ? tree.parent(toBeRemovedNode)!
        : last(tree.inclusiveDescendants(previousSibling))!;
    });
    this.preRemovingSteps = steps;
  }
}
