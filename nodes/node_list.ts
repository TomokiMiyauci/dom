import { at, iter, len, range } from "./../deps.ts";
import { INodeList } from "./../interface.d.ts";
import { Iterable, iterable } from "./../_internals/webidl/iterable.ts";
import { LegacyPlatformObject } from "./../_internals/webidl/legacy_extended_attributes.ts";
import { Getter, getter, WebIDL } from "./../_internals/webidl/idl.ts";
import { tree } from "./../internal.ts";
import { Exposed } from "./../_internals/webidl/extended_attribute.ts";

export const $root = Symbol();
export const $filter = Symbol();

/**
 * @see https://dom.spec.whatwg.org/#concept-collection
 */
export interface CollectionOptions {
  root: Node;
  filter: (node: Node, root: Node) => boolean;
}

@iterable
abstract class CollectiveNodeList extends LegacyPlatformObject
  implements INodeList {
  protected abstract represent(): globalThis.Iterable<Node>;

  [WebIDL.supportedIndexes](): Set<number> {
    const size = len(this.represent());

    if (!size) return new Set();
    return new Set(range(0, size));
  }

  [WebIDL.supportedNamedProperties]: undefined;

  get length(): number {
    return len(this.represent());
  }

  @getter("index")
  item(index: number): Node | null {
    return at(this.represent(), index) ?? null;
  }
}

interface CollectiveNodeList extends Getter<"index", Node>, Iterable<Node> {}

@Exposed("Window", "NodeList")
export class NodeList extends CollectiveNodeList implements INodeList {
  [$root]: Node;
  [$filter]: (node: Node, root: Node) => boolean;

  constructor(options: CollectionOptions) {
    super();

    this[$root] = options.root;
    this[$filter] = options.filter;
  }

  protected override represent(): globalThis.Iterable<Node> {
    const inclusiveDescendants = tree.inclusiveDescendants(this[$root]);

    return iter(inclusiveDescendants).filter((node) =>
      this[$filter](node, this[$root])
    );
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

const $list = Symbol();

export class StaticNodeList<T extends Node> extends CollectiveNodeList
  implements INodeList {
  [$list]: T[];
  constructor(iterable: globalThis.Iterable<T>) {
    super();

    this[$list] = [...iterable];
  }

  protected override represent(): T[] {
    return this[$list];
  }
}
