import { Node } from "./node.ts";
import { type Public } from "../deps.ts";
import { INodeList } from "../interface.d.ts";
import { enumerate } from "../utils.ts";

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
