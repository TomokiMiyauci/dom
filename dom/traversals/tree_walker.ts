import type { ITreeWalker } from "../../interface.d.ts";
import { filter } from "./traversal.ts";
import { NodeFilter } from "./node_filter.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { $, tree } from "../../internal.ts";
import { traverseChildren, traverseSiblings } from "./tree_walker_utils.ts";

@Exposed("Window", "TreeWalker")
export class TreeWalker implements ITreeWalker {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this.#_.root;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this.#_.whatToShow;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-filter)
   */
  get filter(): NodeFilter | null {
    // return this’s filter.
    return this.#_.filter;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  get currentNode(): Node {
    // return this’s current.
    return this.#_.current;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  set currentNode(value: Node) {
    // set this’s current to the given value.
    this.#_.current = value;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-parentnode)
   */
  parentNode(): Node | null {
    // 1. Let node be this’s current.
    let node: Node | null = this.#_.current;

    // 2. While node is non-null and is not this’s root:
    while (node && node !== this.#_.root) {
      // 1. Set node to node’s parent.
      node = tree.parent(node);

      // 2. If node is non-null and filtering node within this returns FILTER_ACCEPT, then set this’s current to node and return node.
      if (node && filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this.#_.current = node;
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
  previousNode(): Node | null {
    // 1. Let node be this’s current.
    let node = this.#_.current;

    // 2. While node is not this’s root:
    while (node !== this.#_.root) {
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
          this.#_.current = node;
          return node;
        }

        // 5. Set sibling to node’s previous sibling.
        sibling = tree.previousSibling(node);
      }

      const parent = tree.parent(node);
      // 3. If node is this’s root or node’s parent is null, then return null.
      if (node === this.#_.root || !parent) return null;

      // 4. Set node to node’s parent.
      node = parent;

      // 5. If the return value of filtering node within this is FILTER_ACCEPT, then set this’s current to node and return node.
      if (filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this.#_.current = node;
        return node;
      }
    }

    // 3. Return null.
    return null;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-nextnode)
   */
  nextNode(): Node | null {
    // 1. Let node be this’s current.
    let node = this.#_.current;

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
          this.#_.current = node;
          return node;
        }
      }

      // 2. Let sibling be null.
      let sibling: Node | null = null;

      // 3. Let temporary be node.
      let temporary: Node | null = node;

      // 4. While temporary is non-null:
      while (temporary) {
        // 1. If temporary is this’s root, then return null.
        if (temporary === this.#_.root) return null;

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
        this.#_.current = node;
        return node;
      }
    }
  }

  [Symbol.toStringTag] = "TreeWalker";

  get #_() {
    return $<TreeWalker>(this);
  }
}

export class TreeWalkerInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  activeFlag: boolean | null = null;

  root: Node;

  whatToShow: number;

  filter: NodeFilter | null;

  current: Node;

  constructor({ filter, whatToShow, root, current }: {
    filter: NodeFilter | null;
    whatToShow: number;
    root: Node;
    current: Node;
  }) {
    this.filter = filter;
    this.whatToShow = whatToShow;
    this.root = root;
    this.current = current;
  }
}
