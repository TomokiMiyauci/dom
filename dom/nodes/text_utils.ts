import { type CharacterDataInternals } from "./character_data.ts";
import { isText } from "./utils.ts";
import { List } from "../../infra/data_structures/list.ts";
import { composeIs, Constructor, iter } from "../../deps.ts";
import { concatString } from "../../infra/string.ts";
import { $, tree } from "../../internal.ts";
import { Get } from "../../utils.ts";
import { Tree } from "../infra/tree.ts";

export function isExclusiveTextNode(text: Text): text is Text {
  return true;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-child-text-content
 */
export function getChildTextContent(node: Node): string {
  // concatenation of the data of all the Text node children of node, in tree order.
  return iter(tree.children(node))
    .filter(isText)
    .map<CharacterDataInternals>($)
    .map(Get.data)
    .toArray()
    .join("");
}

const isNodeExclusiveTextNode = composeIs(isText, isExclusiveTextNode);

export function TextTree<T extends Constructor<Tree<Node>>>(
  Ctor: T,
): T & Constructor<TextTree> {
  abstract class Mixin extends Ctor implements TextTree {
    contiguousTextNodes(node: Node): IterableIterator<Text> {
      return contiguousNodes(node, isText, this);
    }

    contiguousExclusiveTextNodes(node: Node): IterableIterator<Text> {
      return contiguousNodes(node, isNodeExclusiveTextNode, this);
    }

    descendantTextContent(node: Node): string {
      // node is the concatenation of the data of all the Text node descendants of node, in tree order.
      const descendants = this.descendants(node);
      const datalist = iter(descendants)
        .filter(isText)
        .map<CharacterDataInternals>($)
        .map(Get.data);

      return concatString(new List(datalist));
    }
  }

  return Mixin;
}

export interface TextTree {
  /** Yield contiguous {@linkcode Text} nodes of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#contiguous-text-nodes)
   */
  contiguousTextNodes(node: Node): IterableIterator<Text>;

  /** Yield contiguous inclusive {@linkcode Text} nodes of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#contiguous-exclusive-text-nodes)
   */
  contiguousExclusiveTextNodes(node: Node): IterableIterator<Text>;

  /** Return the concatenation of the data of all the {@linkcode Text} node descendants of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-descendant-text-content)
   */
  descendantTextContent(node: Node): string;
}

type TreeAccessor = Pick<Tree<Node>, "previousSibling" | "nextSibling">;

export function contiguousNodes<T extends Node>(
  node: Node,
  predicate: (node: Node) => node is T,
  accessor: TreeAccessor,
): IterableIterator<T>;
export function contiguousNodes(
  node: Node,
  predicate: (node: Node) => boolean,
  accessor: TreeAccessor,
): IterableIterator<Node>;
export function* contiguousNodes(
  node: Node,
  predicate: (node: Node) => boolean,
  accessor: TreeAccessor,
): IterableIterator<Node> {
  do {
    const previousSibling = accessor.previousSibling(node);

    if (previousSibling && predicate(previousSibling)) {
      node = previousSibling;
    } else break;
  } while (true);

  while (predicate(node)) {
    yield node;
    const nextSibling = accessor.nextSibling(node);

    if (nextSibling) node = nextSibling;
    else break;
  }
}
