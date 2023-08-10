import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { IChildNode } from "../interface.d.ts";

export class ChildNode implements IChildNode {
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
