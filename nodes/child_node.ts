import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { IChildNode } from "../interface.d.ts";
import { Constructor } from "../deps.ts";

export function ChildNode<T extends Constructor>(Ctor: T) {
  abstract class ChildNode extends Ctor implements ChildNode {
    after(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    before(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    replaceWith(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    remove(): void {
      throw new UnImplemented();
    }
  }

  return ChildNode;
}

// deno-lint-ignore no-empty-interface
export interface ChildNode extends IChildNode {}
