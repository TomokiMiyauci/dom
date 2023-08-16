import { Node } from "./node.ts";
import { enumerate, first, islice, len, type Public } from "../deps.ts";
import { INodeList } from "../interface.d.ts";
import { Collection, CollectionOptions } from "./collection.ts";
import { Indexer } from "../utils.ts";
import { orderTreeChildren } from "../trees/tree.ts";

function getElementByIndex(
  this: NodeList,
  index: number,
): Node | undefined {
  return this.getItem(index);
}

@Indexer(getElementByIndex)
export class NodeList extends Collection<Node> implements INodeList {
  [k: number]: Node;

  constructor(options: CollectionOptions<Node>) {
    super(options);
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

export class StaticNodeList<T extends Node> extends NodeList
  implements INodeList {
  private list: Iterable<T>;
  constructor(root: Node, list: Iterable<T>) {
    super({ root, filter: (_: Node): _ is Node => true });

    this.list = list;
  }

  protected override represent(): Iterable<T> {
    return orderTreeChildren(this.list);
  }
}
