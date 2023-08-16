import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import { type Element } from "./element.ts";
import type { IParentNode } from "../interface.d.ts";
import { StaticNodeList } from "./node_list.ts";
import { matchScopedSelectorsString } from "../trees/selector.ts";
import { HTMLCollection } from "./html_collection.ts";

// deno-lint-ignore no-explicit-any
export function ParentNode<T extends abstract new (...args: any[]) => Node>(
  Ctor: T,
) {
  abstract class ParentNode extends Ctor implements IParentNode {
    get childElementCount(): number {
      throw new UnImplemented();
    }

    get children(): HTMLCollection {
      return new HTMLCollection({
        root: this,
        filter: (node) => {
          return this._children.contains(node);
        },
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

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-queryselector
     */
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
    querySelector<E extends Element = Element>(
      selectors: string,
    ): E | null;
    querySelector(
      selectors: string,
    ): Element | null {
      // return the first result of running scope-match a selectors string selectors against this, if the result is not an empty list;
      return matchScopedSelectorsString(selectors, this)[0] ?? null;
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
    querySelectorAll<E extends Element = Element>(
      selectors: string,
    ): NodeListOf<E>;
    querySelectorAll(
      selectors: string,
    ): NodeListOf<Element> {
      return new StaticNodeList(matchScopedSelectorsString(selectors, this));
    }
  }

  return ParentNode;
}

// deno-lint-ignore no-empty-interface
export interface ParentNode extends IParentNode {}
