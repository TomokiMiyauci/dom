import { filter } from "../traversal.ts";
import { NodeFilter } from "../node_filter.ts";
import { tree } from "../../internal.ts";
import * as $$ from "../../symbol.ts";
import type { $Node, $TreeWalker } from "../../i.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traverse-children)
 */
export function traverseChildren(
  walker: $TreeWalker,
  type: "first" | "last",
): $Node | null {
  // 1. Let node be walker’s current.
  let node: $Node | null = walker[$$.current];

  // 2. Set node to node’s first child if type is first, and node’s last child if type is last.
  node = type === "first" ? tree.firstChild(node) : tree.lastChild(node);

  // 3. While node is non-null:
  while (node) {
    // 1. Let result be the result of filtering node within walker.
    const result = filter(node, walker);

    // 2. If result is FILTER_ACCEPT, then set walker’s current to node and return node.
    if (result === NodeFilter.FILTER_ACCEPT) {
      walker[$$.current] = node;
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
        parent === walker[$$.root] ||
        parent === walker[$$.current]
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
  walker: $TreeWalker,
  type: "next" | "previous",
): $Node | null {
  // 1. Let node be walker’s current.
  let node = walker[$$.current];

  // 2. If node is root, then return null.
  if (node === walker[$$.root]) return null;

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
        walker[$$.current] = node;
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
    if (!node || node === walker[$$.root]) return null;

    // 5. If the return value of filtering node within walker is FILTER_ACCEPT, then return null.
    if (filter(node, walker) === NodeFilter.FILTER_ACCEPT) return null;
  }
}
