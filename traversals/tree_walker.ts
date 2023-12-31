import type { ITreeWalker } from "../interface.d.ts";
import { filter } from "./traversal.ts";
import { NodeFilter } from "./node_filter.ts";
import {
  Exposed,
  SameObject,
} from "../_internals/webidl/extended_attribute.ts";
import { tree } from "../internal.ts";
import { traverseChildren, traverseSiblings } from "./utils/tree_walker.ts";
import type { $Node } from "../i.ts";
import * as $$ from "../symbol.ts";

@Exposed("Window", "TreeWalker")
export class TreeWalker implements ITreeWalker {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this[$$.root];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this[$$.whatToShow];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-filter)
   */
  get filter(): NodeFilter | null {
    // return this’s filter.
    return this[$$.filter];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  get currentNode(): $Node {
    // return this’s current.
    return this[$$.current];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  set currentNode(value: $Node) {
    // set this’s current to the given value.
    this[$$.current] = value;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-parentnode)
   */
  parentNode(): $Node | null {
    // 1. Let node be this’s current.
    let node: $Node | null = this[$$.current];

    // 2. While node is non-null and is not this’s root:
    while (node && node !== this[$$.root]) {
      // 1. Set node to node’s parent.
      node = tree.parent(node);

      // 2. If node is non-null and filtering node within this returns FILTER_ACCEPT, then set this’s current to node and return node.
      if (node && filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this[$$.current] = node;
        return node;
      }
    }

    // 3. Return null.
    return null;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-firstchild)
   */
  firstChild(): Node | null {
    // traverse children with this and first.
    return traverseChildren(this, "first");
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-lastchild)
   */
  lastChild(): Node | null {
    // traverse children with this and last.
    return traverseChildren(this, "last");
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-nextsibling)
   */
  nextSibling(): Node | null {
    // traverse siblings with this and next.
    return traverseSiblings(this, "next");
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-previoussibling)
   */
  previousSibling(): Node | null {
    // traverse siblings with this and previous.
    return traverseSiblings(this, "previous");
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-previousnode)
   */
  previousNode(): $Node | null {
    // 1. Let node be this’s current.
    let node = this[$$.current];

    // 2. While node is not this’s root:
    while (node !== this[$$.root]) {
      // 1. Let sibling be node’s previous sibling.
      let sibling = tree.previousSibling(node);

      // 2. While sibling is non-null:
      while (sibling) {
        // 1. Set node to sibling.
        node = sibling;

        // 2. Let result be the result of filtering node within this.
        let result = filter(node, this);

        // 3. While result is not FILTER_REJECT and node has a child:
        while (
          result !== NodeFilter.FILTER_REJECT && !tree.children(node).isEmpty
        ) {
          // 1. Set node to node’s last child.
          node = tree.lastChild(node)!; // Assert child exists

          // 2. Set result to the result of filtering node within this.
          result = filter(node, this);
        }

        // 4. If result is FILTER_ACCEPT, then set this’s current to node and return node.
        if (result === NodeFilter.FILTER_ACCEPT) {
          this[$$.current] = node;
          return node;
        }

        // 5. Set sibling to node’s previous sibling.
        sibling = tree.previousSibling(node);
      }

      const parent = tree.parent(node);
      // 3. If node is this’s root or node’s parent is null, then return null.
      if (node === this[$$.root] || !parent) return null;

      // 4. Set node to node’s parent.
      node = parent;

      // 5. If the return value of filtering node within this is FILTER_ACCEPT, then set this’s current to node and return node.
      if (filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this[$$.current] = node;
        return node;
      }
    }

    // 3. Return null.
    return null;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-nextnode)
   */
  nextNode(): $Node | null {
    // 1. Let node be this’s current.
    let node = this[$$.current];

    // 2. Let result be FILTER_ACCEPT.
    let result: number = NodeFilter.FILTER_ACCEPT;

    // 3. While true:
    while (true) {
      // 1. While result is not FILTER_REJECT and node has a child:
      while (
        result !== NodeFilter.FILTER_REJECT && !tree.children(node).isEmpty
      ) {
        // 1. Set node to its first child.
        node = tree.firstChild(node)!; // Assert child exists

        // 2. Set result to the result of filtering node within this.
        result = filter(node, this);

        // 3. If result is FILTER_ACCEPT, then set this’s current to node and return node.
        if (result === NodeFilter.FILTER_ACCEPT) {
          this[$$.current] = node;
          return node;
        }
      }

      // 2. Let sibling be null.
      let sibling: $Node | null = null;

      // 3. Let temporary be node.
      let temporary: $Node | null = node;

      // 4. While temporary is non-null:
      while (temporary) {
        // 1. If temporary is this’s root, then return null.
        if (temporary === this[$$.root]) return null;

        // 2. Set sibling to temporary’s next sibling.
        sibling = tree.nextSibling(temporary);

        // 3. If sibling is non-null, then set node to sibling and break.
        if (sibling) {
          node = sibling;
          break;
        }

        // 4. Set temporary to temporary’s parent.
        temporary = tree.parent(temporary);
      }

      // 5. Set result to the result of filtering node within this.
      result = filter(node, this);

      // 6. If result is FILTER_ACCEPT, then set this’s current to node and return node.
      if (result === NodeFilter.FILTER_ACCEPT) {
        this[$$.current] = node;
        return node;
      }
    }
  }

  [Symbol.toStringTag] = "TreeWalker";

  [$$.activeFlag]: boolean | null = null;
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
  [$$.current]!: $Node;
  /**
   * @remarks set after creation
   */
  [$$.root]!: $Node;
}
