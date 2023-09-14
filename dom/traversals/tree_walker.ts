import type { ITreeWalker } from "../../interface.d.ts";
import { filter } from "./traversal.ts";
import { NodeFilter } from "./node_filter.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { tree } from "../../internal.ts";

@Exposed(Window)
export class TreeWalker implements ITreeWalker {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-root)
   */
  @SameObject
  get root(): Node {
    // return this’s root.
    return this._root;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-whattoshow)
   */
  get whatToShow(): number {
    // return this’s whatToShow.
    return this._whatToShow;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-filter)
   */
  get filter(): NodeFilter | null {
    // return this’s filter.
    return this._filter;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  get currentNode(): Node {
    // return this’s current.
    return this._current;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-currentnode)
   */
  set currentNode(value: Node) {
    // set this’s current to the given value.
    this._current = value;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-treewalker-parentnode)
   */
  parentNode(): Node | null {
    // 1. Let node be this’s current.
    let node: Node | null = this._current;

    // 2. While node is non-null and is not this’s root:
    while (node && node !== this._root) {
      // 1. Set node to node’s parent.
      node = tree.parent(node);

      // 2. If node is non-null and filtering node within this returns FILTER_ACCEPT, then set this’s current to node and return node.
      if (node && filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this._current = node;
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
    let node = this._current;

    // 2. While node is not this’s root:
    while (node !== this._root) {
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
          this._current = node;
          return node;
        }

        // 5. Set sibling to node’s previous sibling.
        sibling = tree.previousSibling(node);
      }

      const parent = tree.parent(node);
      // 3. If node is this’s root or node’s parent is null, then return null.
      if (node === this._root || !parent) return null;

      // 4. Set node to node’s parent.
      node = parent;

      // 5. If the return value of filtering node within this is FILTER_ACCEPT, then set this’s current to node and return node.
      if (filter(node, this) === NodeFilter.FILTER_ACCEPT) {
        this._current = node;
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
    let node = this._current;

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
          this._current = node;
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
        if (temporary === this._root) return null;

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
        this._current = node;
        return node;
      }
    }
  }

  [Symbol.toStringTag] = "TreeWalker";

  // internal
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  protected _activeFlag: boolean | null = null;

  protected _root!: Node;

  protected _whatToShow!: number;

  protected _filter!: NodeFilter | null;

  protected _current!: Node;
}

export function traverseChildren(
  walker: TreeWalker,
  type: "first" | "last",
): Node | null {
  // 1. Let node be walker’s current.
  let node: Node | null = walker["_current"];

  // 2. Set node to node’s first child if type is first, and node’s last child if type is last.
  node = type === "first" ? tree.firstChild(node) : tree.lastChild(node);

  // 3. While node is non-null:
  while (node) {
    // 1. Let result be the result of filtering node within walker.
    const result = filter(node, walker);

    // 2. If result is FILTER_ACCEPT, then set walker’s current to node and return node.
    if (result === NodeFilter.FILTER_ACCEPT) {
      walker["_current"] = node;
      return node;
    }

    // 3. If result is FILTER_SKIP, then:
    if (result === NodeFilter.FILTER_SKIP) {
      // 1. Let child be node’s first child if type is first, and node’s last child if type is last.
      const child = type === "first"
        ? tree.firstChild(node)
        : tree.lastChild(node);

      // 2. If child is non-null, then set node to child and continue.
      if (child) {
        node = child;
        continue;
      }
    }

    // 4. While node is non-null:
    while (node) {
      // 1. Let sibling be node’s next sibling if type is first, and node’s previous sibling if type is last.
      const sibling = type === "first"
        ? tree.nextSibling(node)
        : tree.previousSibling(node);

      // 2. If sibling is non-null, then set node to sibling and break.
      if (sibling) {
        node = sibling;
        break;
      }

      // 3. Let parent be node’s parent.
      const parent = tree.parent(node);

      // 4. If parent is null, walker’s root, or walker’s current, then return null.
      if (
        !parent ||
        parent === walker["_root"] ||
        parent === walker["_current"]
      ) return null;

      // 5. Set node to parent.
      node = parent;
    }
  }

  // 4. Return null.
  return null;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traverse-siblings)
 */
export function traverseSiblings(
  walker: TreeWalker,
  type: "next" | "previous",
): Node | null {
  // 1. Let node be walker’s current.
  let node = walker["_current"];

  // 2. If node is root, then return null.
  if (node === walker["_root"]) return null;

  // 3. While true:
  while (true) {
    // 1. Let sibling be node’s next sibling if type is next, and node’s previous sibling if type is previous.
    let sibling = type === "next"
      ? tree.nextSibling(node)
      : tree.previousSibling(node);

    // 2. While sibling is non-null:
    while (sibling) {
      // 1. Set node to sibling.
      node = sibling;

      // 2. Let result be the result of filtering node within walker.
      const result = filter(node, walker);

      // 3. If result is FILTER_ACCEPT, then set walker’s current to node and return node.
      if (result === NodeFilter.FILTER_ACCEPT) {
        walker["_current"] = node;
        return node;
      }

      // 4. Set sibling to node’s first child if type is next, and node’s last child if type is previous.
      sibling = type === "next" ? tree.firstChild(node) : tree.lastChild(node);

      // 5. If result is FILTER_REJECT or sibling is null, then set sibling to node’s next sibling if type is next, and node’s previous sibling if type is previous.
      if (result === NodeFilter.FILTER_REJECT || !sibling) {
        sibling = type === "next"
          ? tree.nextSibling(node)
          : tree.previousSibling(node);
      }
    }

    // 3. Set node to node’s parent.
    node = tree.parent(node)!;

    // 4. If node is null or walker’s root, then return null.
    if (!node || node === walker["_root"]) return null;

    // 5. If the return value of filtering node within walker is FILTER_ACCEPT, then return null.
    if (filter(node, walker) === NodeFilter.FILTER_ACCEPT) return null;
  }
}
