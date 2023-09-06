import type { INodeIterator } from "../../interface.d.ts";
import type { Node } from "../nodes/node.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { orderSubtree } from "../infra/tree.ts";
import { filter } from "./traversal.ts";
import { NodeFilter } from "./node_filter.ts";
import { dropwhile, first, last, takewhile } from "../../deps.ts";

@Exposed(Window)
export class NodeIterator implements INodeIterator {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this._root;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-referencenode)
   */
  get referenceNode(): Node {
    // return this’s reference.
    return this._reference;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-pointerbeforereferencenode)
   */
  get pointerBeforeReferenceNode(): boolean {
    // return this’s pointer before reference.
    return this._pointerBeforeReference;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this._whatToShow;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-nodeiterator-filter)
   */
  get filter(): NodeFilter | null {
    return this._filter;
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

  // internal
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  protected _activeFlag: boolean | null = null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-root)
   */
  protected _root!: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-whattoshow)
   */
  protected _whatToShow!: number;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-filter)
   */
  protected _filter!: NodeFilter | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#iterator-collection)
   */
  protected get _iteratorCollection(): IterableIterator<Node> {
    return orderSubtree(this._root);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-reference)
   */
  protected _reference!: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pointer-before-reference)
   */
  protected _pointerBeforeReference!: boolean;
}

enum Direction {
  Next,
  Previous,
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-nodeiterator-traverse)
 */
export function traverse(
  iterator: NodeIterator,
  direction: Direction,
): Node | null {
  // 1. Let node be iterator’s reference.
  let node = iterator["_reference"];

  // 2. Let beforeNode be iterator’s pointer before reference.
  let beforeNode = iterator["_pointerBeforeReference"];

  // 3. While true:
  while (true) {
    // 1. Branch on direction:
    switch (direction) {
      // next
      case Direction.Next: {
        // If beforeNode is false, then set node to the first node following node in iterator’s iterator collection. If there is no such node, then return null.
        if (!beforeNode) {
          const following = dropwhile(
            iterator["_iteratorCollection"],
            (_, prev) => node !== prev,
          );
          const firstNode = first(following);

          if (!firstNode) return null;
          node = firstNode;
        }

        // If beforeNode is true, then set it to false.
        if (beforeNode) beforeNode = false;
        break;
      }

      // previous
      case Direction.Previous: {
        // If beforeNode is true, then set node to the first node preceding node in iterator’s iterator collection. If there is no such node, then return null.
        if (beforeNode) {
          const preceding = takewhile(
            iterator["_iteratorCollection"],
            (other) => node !== other,
          );
          const lastNode = last(preceding);

          if (!lastNode) return null;

          node = lastNode;
        }

        // If beforeNode is false, then set it to true.
        if (!beforeNode) beforeNode = true;
      }
    }

    // 2. Let result be the result of filtering node within iterator.
    const result = filter(node, iterator);

    // 3. If result is FILTER_ACCEPT, then break.
    if (result === NodeFilter.FILTER_ACCEPT) break;
  }

  // 4. Set iterator’s reference to node.
  iterator["_reference"] = node;

  // 5. Set iterator’s pointer before reference to beforeNode.
  iterator["_pointerBeforeReference"] = beforeNode;

  // 6. Return node.
  return node;
}
