import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import { type Element } from "./element.ts";
import type { IParentNode } from "../interface.d.ts";
import { StaticNodeList } from "./node_list.ts";
import { matchScopedSelectorsString } from "../trees/selector.ts";
import { HTMLCollection } from "./html_collection.ts";

// deno-lint-ignore no-explicit-any
export function ParentNode<T extends { new (...args: any[]): Node }>(Ctor: T) {
  return class extends Ctor implements IParentNode {
    get childElementCount(): number {
      throw new UnImplemented();
    }

    get children(): HTMLCollection {
      return new HTMLCollection(this, (node) => {
        return this._children.contains(node);
      });
    }

    get firstElementChild(): Element | null {
      throw new UnImplemented();
    }

    get lastElementChild(): Element | null {
      throw new UnImplemented();
    }

    prepend(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    append(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    replaceChildren(...nodes: (string | Node)[]): void {
      throw new UnImplemented();
    }

    querySelector<K extends keyof HTMLElementTagNameMap>(
      selectors: K,
    ): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(
      selectors: K,
    ): SVGElementTagNameMap[K] | null;
    querySelector<K extends keyof MathMLElementTagNameMap>(
      selectors: K,
    ): MathMLElementTagNameMap[K] | null;
    querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(
      selectors: K,
    ): HTMLElementDeprecatedTagNameMap[K] | null;
    querySelector<E extends globalThis.Element = globalThis.Element>(
      selectors: string,
    ): E | null;
    querySelector(
      selectors: unknown,
    ):
      | E
      | HTMLElementTagNameMap[K]
      | SVGElementTagNameMap[K]
      | MathMLElementTagNameMap[K]
      | HTMLElementDeprecatedTagNameMap[K]
      | null {
      throw new UnImplemented();
    }

    querySelectorAll<K extends keyof HTMLElementTagNameMap>(
      selectors: K,
    ): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(
      selectors: K,
    ): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<K extends keyof MathMLElementTagNameMap>(
      selectors: K,
    ): NodeListOf<MathMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(
      selectors: K,
    ): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
    querySelectorAll<E extends globalThis.Element = globalThis.Element>(
      selectors: string,
    ): NodeListOf<E>;
    querySelectorAll(selectors: string):
      | NodeListOf<HTMLElementTagNameMap[Node]>
      | NodeListOf<SVGElementTagNameMap[Node]>
      | NodeListOf<MathMLElementTagNameMap[Node]>
      | NodeListOf<HTMLElementDeprecatedTagNameMap[Node]>
      | NodeListOf<Node>;
    querySelectorAll(selectors: string):
      | NodeListOf<HTMLElementTagNameMap[Node]>
      | NodeListOf<SVGElementTagNameMap[Node]>
      | NodeListOf<MathMLElementTagNameMap[Node]>
      | NodeListOf<HTMLElementDeprecatedTagNameMap[Node]>
      | NodeListOf<Node> {
      return new StaticNodeList(matchScopedSelectorsString(selectors, this));
    }
  };
}
