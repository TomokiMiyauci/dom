import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { IChildNode } from "../interface.d.ts";
import { type Constructor, find, isObject } from "../deps.ts";
import { preInsertNode, removeNode } from "./mutation.ts";
import { getFollowingSiblings } from "../trees/tree.ts";
import { convertNodesToNode } from "./parent_node.ts";
import { $nodeDocument } from "./internal.ts";
import { convert, DOMString } from "../webidl/types.ts";

export function ChildNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class ChildNode extends Ctor implements ChildNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-childnode-after
     */
    @convert
    after(@DOMString.exclude(isObject) ...nodes: (string | Node)[]): void {
      // 1. Let parent be this’s parent.
      const parent = this._parent;

      // 2. If parent is null, then return.
      if (!parent) return;

      const followingSiblings = getFollowingSiblings(this);
      const set = new Set(nodes);
      const notHas = (node: Node): boolean => !set.has(node);
      // 3. Let viableNextSibling be this’s first following sibling not in nodes; otherwise null.
      const viableNextSibling = find(followingSiblings, notHas) ?? null;

      // 4. Let node be the result of converting nodes into a node, given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this[$nodeDocument]);

      // 5. Pre-insert node into parent before viableNextSibling.
      preInsertNode(node, parent, viableNextSibling);
    }

    before(...nodes: (string | Node)[]): void {
      throw new UnImplemented("before");
    }

    replaceWith(...nodes: (string | Node)[]): void {
      throw new UnImplemented("replaceWith");
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-childnode-remove
     */
    remove(): void {
      // If this’s parent is null, then return.
      if (!this._parent) return;

      // Remove this.
      removeNode(this);
    }
  }

  return ChildNode;
}

// deno-lint-ignore no-empty-interface
export interface ChildNode extends IChildNode {}
