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

export class Collection<T extends Node> {
  #root: T;
  #filter: (node: T) => boolean;

  constructor(states: CollectionStates<T>) {
    this.#root = states.root;
    this.#filter = states.filter;
  }

  /**
   * @see https://dom.spec.whatwg.org/#represented-by-the-collection
   */
  protected *represent(): Iterable<T> {
    yield* ifilter(orderTree(this.#root), this.#filter);
  }
}
