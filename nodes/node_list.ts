import { Node } from "./node.ts";
import { enumerate, type Public } from "../deps.ts";
import { INodeList } from "../interface.d.ts";
import { type Element } from "./element.ts";

export class NodeList implements INodeList {
  [k: number]: Node;

  _root: Node;
  _filter: (node: Node) => boolean;

  constructor(root: Node, filter: (node: Node) => boolean) {
    this._root = root;
    this._filter = filter;
  }

  get length(): number {
    return this._root._children.size;
  }

  item(index: number): Node | null {
    return this._root._children[index];
  }

  forEach(
    callbackfn: (value: Node, key: number, parent: Public<NodeList>) => void,
    thisArg?: any,
  ): void {
    for (const [index, child] of enumerate(this._root._children)) {
      callbackfn.call(thisArg, child, index, this);
    }
  }
}

export interface NodeListOf<T extends Node> extends Public<NodeList> {
  [index: number]: T;
  item(index: number): T;
  forEach(
    callbackfn: (value: T, key: number, parent: NodeListOf<T>) => void,
    thisArg?: any,
  ): void;
}

export class StaticNodeList implements INodeList {
  #items: Element[];

  constructor(ref: Element[]) {
    this.#items = ref;
  }

  item(index: number): Element | null {
    return this.#items[index] ?? null;
  }

  get length(): number {
    return this.#items.length;
  }

  forEach(
    callbackfn: (value: Node, key: number, parent: any) => void,
    thisArg?: any,
  ): void {
    this.#items.forEach(callbackfn, thisArg);
  }

  *[Symbol.iterator]() {
    yield* this.#items;
  }
}
