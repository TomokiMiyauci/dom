import { ifilter } from "../deps.ts";
import { orderTree } from "../trees/tree.ts";
import type { Node } from "./node.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-collection
 */
export interface CollectionStates<T extends Node> {
  root: T;
  filter: (node: T) => boolean;
}

export type Mode = "live" | "static";

export interface CollectionOptions<T extends Node> extends CollectionStates<T> {
  /**
   * @default "live"
   */
  mode?: Mode;
}

export class Collection<T extends Node> {
  #root: T;
  #filter: (node: T) => boolean;

  constructor(options: CollectionOptions<T>) {
    const root = options.mode === "static"
      ? options.root.cloneNode(true) as T
      : options.root;
    this.#root = root;
    this.#filter = options.filter;
  }

  /**
   * @see https://dom.spec.whatwg.org/#represented-by-the-collection
   */
  protected *represent(): Iterable<T> {
    yield* ifilter(orderTree(this.#root), this.#filter);
  }
}
