import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { IChildNode } from "../interface.d.ts";
import { type Constructor } from "../deps.ts";
import { removeNode } from "./mutation.ts";

export function ChildNode<T extends Constructor<Node>>(Ctor: T) {
  abstract class ChildNode extends Ctor implements ChildNode {
    after(...nodes: (string | Node)[]): void {
      throw new UnImplemented("after");
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
