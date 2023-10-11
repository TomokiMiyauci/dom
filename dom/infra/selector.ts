import {
  matchSelectorToTree,
  parseSelector,
} from "../../_internals/selectors/hook.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { tree } from "../../internal.ts";

/**
 * @throws {DOMException}
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
    tree.root(node),
    [node],
  );
}
