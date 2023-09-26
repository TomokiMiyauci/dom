import { ifilter, initLast, lastItem } from "../deps.ts";
import { isElement } from "../dom/nodes/utils.ts";
import {
  AttributeSelector,
  ClassSelector,
  Combinator,
  ComplexSelector,
  CompoundSelector,
  IDSelector,
  Operator,
  PseudoClassSelector,
  SelectorList,
  SimpleSelector,
  TypeSelector,
} from "./types.ts";
import { selectorToSelectorList } from "./utils.ts";
import { createParser } from "npm:css-selector-parser@2.3.2";
import { toASCIILowerCase } from "../infra/string.ts";
import { tree } from "../internal.ts";

type Failure = string;
type Success = SelectorList;

export type ParseResult = SelectorList | Failure;

const parser = createParser();

/**
 * @see https://drafts.csswg.org/selectors-4/#parse-a-selector
 */
export function parseSelector(source: string): ParseResult {
  try {
    return selectorToSelectorList(parser(source));
  } catch (e: unknown) {
    return resolveMessage(e);
  }
  // 1. Let selector be the result of parsing source as a <selector-list>. If this returns failure, it’s an invalid selector; return failure.

  // 2. If selector is an invalid selector for any other reason (such as, for example, containing an undeclared namespace prefix), return failure.

  // 3. Otherwise, return selector.
}

function resolveMessage(e: unknown): string {
  if (
    e &&
    typeof e === "object" &&
    "message" in e &&
    typeof e.message === "string"
  ) return e.message;

  return String(e);
}

/**
 * @see https://drafts.csswg.org/selectors-4/#match-against-element
 */
export function matchSelector(
  selector: SelectorList,
  element: Element,
  scopingRoots?: [Node, ...Node[]],
): boolean {
  // For each complex selector in the given selector (which is taken to be a list of complex selectors),
  for (const complexSelector of selector) {
    // match the complex selector against element, as described in the following paragraph.
    // If the matching returns success for any complex selector, then the algorithm return success;
    if (matchComplexSelector(complexSelector, element)) return true;
  }

  // otherwise it returns failure.
  return false;
}

function matchCompoundSelector(
  compound: CompoundSelector,
  element: Element,
): boolean {
  return compound.every((simpleSelector) =>
    matchSimpleSelector(simpleSelector, element)
  );
}

/**
 * @see https://drafts.csswg.org/selectors-4/#match-a-complex-selector-against-an-element
 */
export function matchComplexSelector(
  complexSelector: ComplexSelector,
  element: Element,
): boolean {
  const last = lastItem(complexSelector);

  for (const simpleSelector of last[0]) {
    if (!matchSimpleSelector(simpleSelector, element)) return false;
  }

  if (complexSelector.length === 1) return true;

  const [init] = initLast(complexSelector);
  const [rest, lastOf] = initLast(init);
  const elements = resolveCombinator(lastOf!.combinator, element);
  const restComplexSelector: ComplexSelector = [...rest, lastOf!.unit];

  for (const element of elements) {
    if (matchComplexSelector(restComplexSelector, element)) return true;
  }

  return false;

  // process it compound selector at a time, in right-to-left order. This process is defined recursively as follows:
  // - Otherwise, if there is only one compound selector in the complex selector, return success.
  // - Otherwise, consider all possible elements that could be related to this element by the rightmost combinator. If the operation of matching the selector consisting of this selector with the rightmost compound selector and rightmost combinator removed against any one of these elements returns success, then return success. Otherwise, return failure.
}

function resolveCombinator(
  combinator: Combinator,
  element: Element,
): Element[] {
  switch (combinator.type) {
    case "child":
      return element.parentElement ? [element.parentElement] : [];

    case "adjacent-sibling": {
      const previousSibling = element.previousElementSibling;

      return previousSibling ? [previousSibling] : [];
    }

    default:
      throw new Error("");
  }
}

export function matchSimpleSelector(
  simpleSelector: SimpleSelector,
  element: Element,
): boolean {
  switch (simpleSelector.type) {
    case "type":
      return matchTypeSelector(simpleSelector, element);
    case "id":
      return matchIdSelector(simpleSelector, element);
    case "class":
      return matchClassSelector(simpleSelector, element);
    case "universal":
      return true;
    case "attr":
      return matchAttributeSelector(simpleSelector, element);
    case "pseudo-class":
      return matchPseudoClass(simpleSelector, element);
  }
}

export function matchPseudoClass(
  selector: PseudoClassSelector,
  element: Element,
): boolean {
  switch (selector.value) {
    case "not":
      return !matchCompoundSelector(selector.argument, element);

    case "empty":
      return !element.hasChildNodes();

    default:
      throw new Error("");
  }
}

function matchTypeSelector(
  typeSelector: TypeSelector,
  element: Element,
): boolean {
  return element.localName === typeSelector.value;
}

function matchAttributeSelector(
  selector: AttributeSelector,
  element: Element,
): boolean {
  if ("operator" in selector) {
    const value = element.getAttribute(selector.name);

    if (value === null) return false;

    const { selectorValue, attrValue } = "case" in selector
      ? {
        attrValue: toASCIILowerCase(value),
        selectorValue: toASCIILowerCase(selector.value),
      }
      : { attrValue: value, selectorValue: selector.value };

    switch (selector.operator) {
      case Operator.ExactEq:
        return selectorValue === attrValue;
      case Operator.OneOf:
        return matchOneOf(selectorValue, attrValue);
      case Operator.HyphenOf:
        return matchHyphen(selectorValue, attrValue);
      case Operator.StartWith:
        return matchStartWith(selectorValue, attrValue);
      case Operator.EndWith:
        return matchEndWith(selectorValue, attrValue);
      case Operator.PartOf:
        return matchPartOf(selectorValue, attrValue);

      case Operator.Unknown:
      default: {
        throw new Error(`Unknown operator. ${selector.operator}`);
      }
    }
  }

  return !!element.getAttributeNodeNS(null, selector.name);
}

export function matchHyphen(selectorValue: string, attrValue: string): boolean {
  if (selectorValue === attrValue) return true;

  const pattern = new RegExp("^" + selectorValue + "-"); // TODO escape

  return pattern.test(attrValue);
}

export function matchStartWith(
  selectorValue: string,
  attrValue: string,
): boolean {
  return attrValue.startsWith(selectorValue);
}

export function matchEndWith(
  selectorValue: string,
  attrValue: string,
): boolean {
  return attrValue.endsWith(selectorValue);
}

export function matchOneOf(selectorValue: string, attrValue: string): boolean {
  const list = new Set(attrValue.split(" "));

  return list.has(selectorValue);
}

export function matchPartOf(selectorValue: string, attrValue: string): boolean {
  return selectorValue.includes(attrValue);
}

export function matchClassSelector(
  selector: ClassSelector,
  element: Element,
): boolean {
  return element.classList.contains(selector.value);
}

function matchIdSelector(idSelector: IDSelector, element: Element): boolean {
  return element.id === idSelector.value;
}

/**
 * @see https://drafts.csswg.org/selectors-4/#match-against-tree
 */
export function matchSelectorToTree(
  selector: SelectorList,
  rootElement: Node,
  scopingRoots?: Iterable<Node>,
  condition?: Function,
): Element[] {
  // 1. Start with a list of candidate elements, which are the root elements and all of their descendant elements, sorted in shadow-including tree order, unless otherwise specified.
  const candidateElements = new Set(ifilter(
    tree.shadowIncludingDescendants(rootElement),
    isElement,
  ));

  if (scopingRoots) {
    candidateElements.forEach((element) => {
      for (const scoped of scopingRoots) {
        if (!tree.isDescendant(element, scoped)) {
          candidateElements.delete(element);
        }
      }
    });
  }

  // 2. If scoping root were provided, then remove from the candidate elements any elements that are not descendants of at least one scoping root.
  // 3. Initialize the selector match list to empty.
  const selectorMatchList: Element[] = [];

  // 4. For each element in the set of candidate elements:
  for (const element of candidateElements) {
    // 1. If the result of match a selector against an element for element and selector is success, add element to the selector match list.
    if (matchSelector(selector, element)) selectorMatchList.push(element);

    // 2. For each possible pseudo-element associated with element that is one of the pseudo-elements allowed to show up in the match list, if the result of match a selector against a pseudo-element for the pseudo-element and selector is success, add the pseudo-element to the selector match list.
  }

  // This algorithm returns a (possibly empty) list of elements.
  return selectorMatchList;
}
