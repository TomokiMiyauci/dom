// deno-lint-ignore-file no-empty-interface
import type { IChildNode } from "../../../interface.d.ts";
import { Constructor, find, isObject } from "../../../deps.ts";
import {
  preInsertNode,
  removeNode,
  replaceChild,
} from "../node_trees/mutation.ts";
import { convertNodesToNode } from "../node_trees/parent_node.ts";
import { convert, DOMString } from "../../../webidl/types.ts";
import { $, tree } from "../../../internal.ts";

export function ChildNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class ChildNode extends Ctor implements IChildNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-childnode-after
     */
    @convert
    after(@DOMString.exclude(isObject) ...nodes: (string | Node)[]): void {
      // 1. Let parent be this’s parent.
      const parent = tree.parent(this);

      // 2. If parent is null, then return.
      if (!parent) return;

      const followingSiblings = tree.followSiblings(this);
      const set = new Set(nodes);
      const notHas = (node: Node): boolean => !set.has(node);
      // 3. Let viableNextSibling be this’s first following sibling not in nodes; otherwise null.
      const viableNextSibling = find(followingSiblings, notHas) ?? null;

      // 4. Let node be the result of converting nodes into a node, given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this._.nodeDocument);

      // 5. Pre-insert node into parent before viableNextSibling.
      preInsertNode(node, parent, viableNextSibling);
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-childnode-before
     */
    @convert
    before(@DOMString.exclude(isObject) ...nodes: (string | Node)[]): void {
      // 1. Let parent be this’s parent.
      const parent = tree.parent(this);

      // 2. If parent is null, then return.
      if (!parent) return;

      const precedingSiblings = tree.precedeSiblings(this);
      const set = new Set(nodes);
      const notHas = (node: Node): boolean => !set.has(node);

      // 3. Let viablePreviousSibling be this’s first preceding sibling not in nodes; otherwise null.
      let viablePreviousSibling = find(precedingSiblings, notHas) ?? null;

      // 4. Let node be the result of converting nodes into a node, given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this._.nodeDocument);

      // 5. If viablePreviousSibling is null, then set it to parent’s first child;
      if (!viablePreviousSibling) {
        viablePreviousSibling = tree.firstChild(parent);
      } // otherwise to viablePreviousSibling’s next sibling.
      else viablePreviousSibling = tree.nextSibling(viablePreviousSibling);

      // 6. Pre-insert node into parent before viablePreviousSibling.
      preInsertNode(node, parent, viablePreviousSibling);
    }

    @convert
    replaceWith(
      @DOMString.exclude(isObject) ...nodes: (string | Node)[]
    ): void {
      // 1. Let parent be this’s parent.
      const parent = tree.parent(this);

      // 2. If parent is null, then return.
      if (!parent) return;

      const followingSiblings = tree.followSiblings(this);
      const set = new Set(nodes);
      const notHas = (node: Node): boolean => !set.has(node);
      // 3. Let viableNextSibling be this’s first following sibling not in nodes; otherwise null.
      const viableNextSibling = find(followingSiblings, notHas) ?? null;

      // 4. Let node be the result of converting nodes into a node, given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this._.nodeDocument);

      // 5. If this’s parent is parent, replace this with node within parent.
      if (tree.parent(this) === parent) replaceChild(this, node, parent);
      // 6. Otherwise, pre-insert node into parent before viableNextSibling.
      else preInsertNode(node, parent, viableNextSibling);
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-childnode-remove
     */
    remove(): void {
      // If this’s parent is null, then return.
      if (!tree.parent(this)) return;

      // Remove this.
      removeNode(this);
    }

    private get _() {
      return $<ChildNode>(this);
    }
  }

  return ChildNode;
}

export interface ChildNode extends IChildNode {}
