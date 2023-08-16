import { ifilter } from "../deps.ts";
import { orderTree } from "../trees/tree.ts";
import type { Node } from "./node.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-collection
 */
export interface CollectionStates<R extends Node = Node> {
  root: Node;
  filter: (node: Node) => node is R;
}

export type Mode = "live" | "static";

export interface CollectionOptions<R extends Node = Node>
  extends CollectionStates<R> {
  /**
   * @default "live"
   */
  mode?: Mode;
}

export class Collection<R extends Node = Node> {
  #root: Node;
  #filter: (node: Node) => node is R;

  constructor(options: CollectionOptions<R>) {
    const root = options.mode === "static"
      ? options.root.cloneNode(true)
      : options.root;
    this.#root = root;
    this.#filter = options.filter;
  }

  /**
   * @see https://dom.spec.whatwg.org/#represented-by-the-collection
   */
  protected *represent(): Iterable<R> {
    yield* ifilter(orderTree(this.#root), this.#filter);
  }
}
