import { descendant } from "../trees/tree.ts";
import type { Node } from "../nodes/node.ts";
import { ifilter } from "../deps.ts";
import { isElement } from "../nodes/utils.ts";
import type { Element } from "../nodes/element.ts";
import { CssSelectorParser, Selector } from "npm:css-selector-parser";

type Failure = false;

export type ParseResult = Selector | Failure;

const parser = new CssSelectorParser();

/**
 * @see https://drafts.csswg.org/selectors-4/#parse-a-selector
 */
export function parseSelector(source: string): ParseResult {
  try {
    return parser.parse(source);
  } catch {
    return false;
  }
  // 1. Let selector be the result of parsing source as a <selector-list>. If this returns failure, it’s an invalid selector; return failure.

  // 2. If selector is an invalid selector for any other reason (such as, for example, containing an undeclared namespace prefix), return failure.

  // 3. Otherwise, return selector.
}

/**
 * @see https://drafts.csswg.org/selectors-4/#match-against-element
 */
export function matchSelectorAgainstElement(
  selector: Selector,
  element: Element,
): boolean {
  // return element.tagName === "script";

  // If any simple selectors in the rightmost compound selector does not match the element, return failure.
  // Otherwise, if there is only one compound selector in the complex selector, return success.
  // Otherwise, consider all possible elements that could be related to this element by the rightmost combinator. If the operation of matching the selector consisting of this selector with the rightmost compound selector and rightmost combinator removed against any one of these elements returns success, then return success. Otherwise, return failure.
}

/**
 * @see https://drafts.csswg.org/selectors-4/#match-against-tree
 */
export function matchSelectorToTree(
  selector: Selector,
  rootElements: [Node],
  scopingRoots: Node[] = [],
): Element[] {
  // 1. Start with a list of candidate elements, which are the root elements and all of their descendant elements, sorted in shadow-including tree order, unless otherwise specified.
  const candidateElements = [
    ...ifilter(descendant(rootElements[0]), isElement),
  ];

  // 2. If scoping root were provided, then remove from the candidate elements any elements that are not descendants of at least one scoping root.
  // 3. Initialize the selector match list to empty.
  const list: Element[] = [];

  // 4. For each element in the set of candidate elements:
  for (const element of candidateElements) {
    // 1. If the result of match a selector against an element for element and selector is success, add element to the selector match list.
    if (matchSelectorAgainstElement(selector, element)) list.push(element);

    // 2. For each possible pseudo-element associated with element that is one of the pseudo-elements allowed to show up in the match list, if the result of match a selector against a pseudo-element for the pseudo-element and selector is success, add the pseudo-element to the selector match list.
  }

  // This algorithm returns a (possibly empty) list of elements.
  return list;
}
