import { at, ifilter, len, range } from "../../../deps.ts";
import { INodeList } from "../../../interface.d.ts";
import { Iterable, iterable } from "../../../webidl/iterable.ts";
import { LegacyPlatformObject } from "../../../webidl/legacy_extended_attributes.ts";
import { Getter, getter, WebIDL } from "../../../webidl/idl.ts";
import { $filter, $root } from "../internal.ts";
import { tree } from "../../../internal.ts";

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

export class NodeList extends CollectiveNodeList implements INodeList {
  [$root]: Node;
  [$filter]: (node: Node, root: Node) => boolean;

  constructor(options: CollectionOptions) {
    super();

    this[$root] = options.root;
    this[$filter] = options.filter;
  }

  protected override represent(): globalThis.Iterable<Node> {
    return ifilter(
      tree.inclusiveDescendants(this[$root]),
      (node) => this[$filter](node, this[$root]),
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
