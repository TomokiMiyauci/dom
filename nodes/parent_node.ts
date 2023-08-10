import { type Node } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { IParentNode } from "../interface.d.ts";

export class ParentNode implements IParentNode {
  get childElementCount(): number {
    throw new UnImplemented();
  }

  get children(): HTMLCollection {
    throw new UnImplemented();
  }

  get firstElementChild(): any | null {
    throw new UnImplemented();
  }

  lastElementChild: any | null;

  append(...nodes: (string | any)[]): void {
    throw new UnImplemented();
  }

  prepend(...nodes: (string | any)[]): void {
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
    | any
    | HTMLElementTagNameMap[K]
    | SVGElementTagNameMap[K]
    | MathMLElementTagNameMap[K]
    | HTMLElementDeprecatedTagNameMap[K]
    | null {
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
  querySelectorAll(
    selectors: unknown,
  ):
    | any
    | NodeListOf<HTMLElementTagNameMap[K]>
    | NodeListOf<SVGElementTagNameMap[K]>
    | NodeListOf<MathMLElementTagNameMap[K]>
    | NodeListOf<HTMLElementDeprecatedTagNameMap[K]>
    | NodeListOf<E> {
  }

  replaceChildren(...nodes: (string | Node)[]): void {
    throw new UnImplemented();
  }
}
