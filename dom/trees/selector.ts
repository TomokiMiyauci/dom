import { getRoot } from "./tree.ts";
import type { Node } from "../nodes/node.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import type { Element } from "../nodes/element.ts";
import { matchSelectorToTree, parseSelector } from "../../selectors/hook.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";

/**
 * @see https://dom.spec.whatwg.org/#scope-match-a-selectors-string
 */
export function matchScopedSelectorsString(
  selectors: string,
  node: Node,
): Element[] {
  // 1. Let s be the result of parse a selector selectors.
  const s = parseSelector(selectors);

  // 2. If s is failure, then throw a "SyntaxError" DOMException.
  if (typeof s === "string") {
    throw new DOMException("<message>", DOMExceptionName.SyntaxError);
  }

  // 3. Return the result of match a selector against a tree with s and node’s root using scoping root node.
  return matchSelectorToTree(
    s,
    new OrderedSet([getRoot(node)]),
    new OrderedSet([node]),
  );
}
