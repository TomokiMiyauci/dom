import { Node } from "./node.ts";
import { enumerate, first, islice, len, type Public } from "../deps.ts";
import { INodeList } from "../interface.d.ts";
import { Collection } from "./collection.ts";
import { Indexer } from "../utils.ts";

function getElementByIndex(
  this: NodeList,
  index: number,
): Node | undefined {
  return this.getItem(index);
}

@Indexer(getElementByIndex)
export class NodeList extends Collection<Node> implements INodeList {
  [k: number]: Node;

  constructor(root: Node, filter: (node: Node) => boolean) {
    super({ root, filter });
  }

  protected getItem(index: number): Node | undefined {
    if (!Number.isInteger(index)) return undefined;

    return first(islice(this.represent(), index, index + 1));
  }

  get length(): number {
    return len(this.represent());
  }

  item(index: number): Node | null {
    return this.getItem(index) ?? null;
  }

  forEach(
    callbackfn: (value: Node, key: number, parent: Public<NodeList>) => void,
    thisArg?: any,
  ): void {
    for (const [index, child] of enumerate(this.represent())) {
      callbackfn.call(thisArg, child, index, this);
    }
  }

  entries(): IterableIterator<[number, Node]> {
    throw new Error();
  }

  keys(): IterableIterator<number> {
    throw new Error();
  }

  values(): IterableIterator<Node> {
    throw new Error();
  }

  *[Symbol.iterator](): IterableIterator<Node> {
    throw new Error();
  }
}

export interface NodeListOf<T extends Node> extends Public<NodeList> {
  [index: number]: T;
  item(index: number): T;
  forEach(
    callbackfn: (value: T, key: number, parent: NodeListOf<T>) => void,
    thisArg?: any,
  ): void;
  entries(): IterableIterator<[number, T]>;
  keys(): IterableIterator<number>;
  values(): IterableIterator<T>;
  [Symbol.iterator](): IterableIterator<T>;
}

export class StaticNodeList implements INodeList {
  [k: number]: Node;

  #items: Node[];

  constructor(ref: Node[]) {
    this.#items = ref;
  }

  item(index: number): Node | null {
    return this.#items[index] ?? null;
  }

  get length(): number {
    return this.#items.length;
  }

  forEach(
    callbackfn: (value: Node, key: number, parent: Public<NodeList>) => void,
    thisArg?: any,
  ): void {
    this.#items.forEach(
      (node, index) => callbackfn(node, index, this),
      thisArg,
    );
  }

  entries(): IterableIterator<[number, Node]> {
    throw new Error();
  }

  keys(): IterableIterator<number> {
    throw new Error();
  }

  values(): IterableIterator<Node> {
    throw new Error();
  }

  *[Symbol.iterator](): IterableIterator<Node> {
    yield* this.#items;
  }
}
