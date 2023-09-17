import { type CharacterDataInternals } from "./character_data.ts";
import { isText } from "./utils.ts";
import { List } from "../../infra/data_structures/list.ts";
import { iter, takewhile } from "../../deps.ts";
import { concatString } from "../../infra/string.ts";
import { $, tree } from "../../internal.ts";
import { Get } from "../../utils.ts";

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

/**
 * @see https://dom.spec.whatwg.org/#contiguous-text-nodes
 */
export function* contiguousTextNodes(
  node: Text,
): Iterable<Text> {
  const preceding = tree.precedeSiblings(node);
  const precedingTexts = takewhile(preceding, isText);
  const following = tree.followSiblings(node);
  const followingTexts = takewhile(following, isText);

  yield* [...precedingTexts].reverse();
  yield node;
  yield* followingTexts;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-descendant-text-content
 */
export function descendantTextContent(node: Node): string {
  const descendants = tree.descendants(node);
  const dataList = iter(descendants)
    .filter(isText)
    .map<CharacterDataInternals>($)
    .map(Get.data);

  return concatString(new List(dataList));
}
