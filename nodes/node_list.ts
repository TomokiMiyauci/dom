import { Node } from "./node.ts";
import { first, islice, len } from "../deps.ts";
import { INodeList } from "../interface.d.ts";
import { Collection, CollectionOptions } from "./collection.ts";
import { Indexer } from "../utils.ts";
import { Iterable, iterable } from "../webidl/iterable.ts";

function getElementByIndex(
  this: NodeList,
  index: number,
): Node | undefined {
  return this.getItem(index);
}

function hasElement(
  this: NodeList,
  index: number,
): boolean {
  return 0 <= index && index < this.length;
}

@Indexer({ get: getElementByIndex, has: hasElement })
@iterable
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
}

export interface NodeListOf<T extends Node> extends NodeList {
  [index: number]: T;
  item(index: number): T;
  forEach(
    callbackfn: (value: T, key: number, parent: this) => void,
    thisArg?: any,
  ): void;
  entries(): IterableIterator<[number, T]>;
  keys(): IterableIterator<number>;
  values(): IterableIterator<T>;
  [Symbol.iterator](): IterableIterator<T>;
}

// deno-lint-ignore no-empty-interface
export interface NodeList extends Iterable<Node> {}

export class StaticNodeList<T extends Node> extends NodeList
  implements INodeList {
  private list: Iterable<T>;
  constructor(root: Node, list: Iterable<T>) {
    super({ root, filter: (_: Node): _ is Node => true });

    this.list = list;
  }

  protected override represent(): Iterable<T> {
    return this.list;
  }
}
