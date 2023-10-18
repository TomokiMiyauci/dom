import type { INodeIterator } from "../interface.d.ts";
import {
  Exposed,
  SameObject,
} from "../_internals/webidl/extended_attribute.ts";
import { tree } from "../internal.ts";
import { Direction, traverse } from "./utils/node_iterator.ts";
import { Steps } from "../infra/applicable.ts";
import { iter, last } from "../deps.ts";
import { first } from "npm:itertools@2.1.2";
import type { $Node, NodeIteratorInternals as _ } from "../i.ts";
import * as $$ from "../symbol.ts";

@Exposed("Window", "NodeIterator")
export class NodeIterator implements INodeIterator, _ {
  constructor() {
    const steps = new Steps<[NodeIterator, $Node]>();

    steps.define((nodeIterator, toBeRemovedNode) => {
      // 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s reference, or toBeRemovedNode is nodeIterator’s root, then return.
      if (
        !tree.isInclusiveAncestor(
          toBeRemovedNode,
          nodeIterator[$$.reference],
        ) ||
        toBeRemovedNode === nodeIterator[$$.root]
      ) return;

      // 2. If nodeIterator’s pointer before reference is true, then:
      if (nodeIterator[$$.pointerBeforeReference]) return;

      const root = nodeIterator[$$.root];
      const follows = iter(tree.follows(toBeRemovedNode)).filter((node) =>
        tree.isInclusiveDescendant(node, root)
      ).filter((node) => !tree.isInclusiveDescendant(node, toBeRemovedNode));
      // 1. Let next be toBeRemovedNode’s first following node that is an inclusive descendant of nodeIterator’s root and is not an inclusive descendant of toBeRemovedNode, and null if there is no such node.
      const next = first(follows) ?? null;

      // 2. If next is non-null, then set nodeIterator’s reference to next and return.
      if (next) {
        nodeIterator[$$.reference] = next;
        return;
        // 3. Otherwise, set nodeIterator’s pointer before reference to false.
      } else nodeIterator[$$.pointerBeforeReference] = false;

      const previousSibling = tree.previousSibling(toBeRemovedNode);
      // 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if toBeRemovedNode’s previous sibling is null, and to the inclusive descendant of toBeRemovedNode’s previous sibling that appears last in tree order otherwise.
      nodeIterator[$$.reference] = previousSibling === null
        ? tree.parent(toBeRemovedNode)!
        : last(tree.inclusiveDescendants(previousSibling))!;
    });

    this[$$.preRemovingSteps] = steps;
  }
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this[$$.root];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-referencenode)
   */
  get referenceNode(): $Node {
    // return this’s reference.
    return this[$$.reference];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-pointerbeforereferencenode)
   */
  get pointerBeforeReferenceNode(): boolean {
    // return this’s pointer before reference.
    return this[$$.pointerBeforeReference];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this[$$.whatToShow];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-filter)
   */
  get filter(): NodeFilter | null {
    return this[$$.filter];
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

  /**
   * @remarks set after creation
   */
  [$$.root]!: $Node;
  [$$.activeFlag]: boolean = false;

  /**
   * @remarks set after creation
   */
  [$$.reference]!: $Node;

  /**
   * @remarks set after creation
   */
  [$$.whatToShow]!: number;

  /**
   * @remarks set after creation
   */
  [$$.filter]!: NodeFilter | null;

  /**
   * @remarks set after creation
   */
  [$$.pointerBeforeReference]!: boolean;

  /**
   * @remarks set after creation
   */
  [$$.iteratorCollection]: Iterable<$Node> = {
    [Symbol.iterator]: () => {
      return tree.inclusiveDescendants(this[$$.root]);
    },
  };

  [$$.preRemovingSteps]: Steps<
    [nodeIterator: NodeIterator, toBeRemovedNode: $Node]
  >;
}
