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
  UniversalSelector,
} from "./types.ts";
import { selectorToSelectorList } from "./utils.ts";
import { createParser } from "npm:css-selector-parser@2.3.2";
import { toASCIILowerCase } from "../infra/string.ts";
import { tree } from "../internal.ts";
import { isActuallyDisabled } from "../html/elements/disabled_element.ts";

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
  scopingRoots?: ScopingRoots,
): boolean {
  // For each complex selector in the given selector (which is taken to be a list of complex selectors),
  for (const complexSelector of selector) {
    // match the complex selector against element, as described in the following paragraph.
    // If the matching returns success for any complex selector, then the algorithm return success;
    if (matchComplexSelector(complexSelector, element, scopingRoots)) {
      return true;
    }
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
  scopingRoots?: ScopingRoots,
): boolean {
  const last = lastItem(complexSelector);

  for (const simpleSelector of last[0]) {
    if (!matchSimpleSelector(simpleSelector, element, scopingRoots)) {
      return false;
    }
  }

  if (complexSelector.length === 1) return true;

  const [init] = initLast(complexSelector);
  const [rest, lastOf] = initLast(init);
  const elements = resolveCombinator(lastOf!.combinator, element);
  const restComplexSelector: ComplexSelector = [...rest, lastOf!.unit];

  for (const element of elements) {
    if (matchComplexSelector(restComplexSelector, element, scopingRoots)) {
      return true;
    }
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

    case "descendant": {
      return [...tree.ancestors(element)].filter(isElement);
    }

    case "general-sibling": {
      return [...tree.precedeSiblings(element)].filter(isElement);
    }

    default:
      throw new Error(`the combinator is not supported: ${combinator.type}`);
  }
}

export function matchSimpleSelector(
  simpleSelector: SimpleSelector,
  element: Element,
  scopingRoots?: ScopingRoots,
): boolean {
  switch (simpleSelector.type) {
    case "type":
      return matchTypeSelector(simpleSelector, element);
    case "id":
      return matchIdSelector(simpleSelector, element);
    case "class":
      return matchClassSelector(simpleSelector, element);
    case "universal":
      return matchUniversalSelector(simpleSelector, element);
    case "attr":
      return matchAttributeSelector(simpleSelector, element);
    case "pseudo-class":
      return matchPseudoClass(simpleSelector, element, scopingRoots);
  }
}

export function matchPseudoClass(
  selector: PseudoClassSelector,
  element: Element,
  scopingRoots?: ScopingRoots,
): boolean {
  switch (selector.value) {
    case "not":
      return !matchCompoundSelector(selector.argument, element);

    case "empty":
      return !element.textContent;

    case "first-child":
      return element.parentNode?.firstElementChild === element;

    case "last-child":
      return element.parentNode?.lastElementChild === element;

    case "scope": {
      if (!scopingRoots) return false;

      return scopingRoots.includes(element);
    }

    case "disabled":
      return isActuallyDisabled(element);

    default:
      throw new Error("");
  }
}

function matchTypeSelector(
  selector: TypeSelector,
  element: Element,
): boolean {
  const matchedName = element.localName === selector.value;

  if (!matchedName) return false;
  if (!selector.namespace) return true;

  switch (selector.namespace.type) {
    case "NamespaceName":
      return element.namespaceURI === selector.namespace.name;
    case "NoNamespace":
      return element.namespaceURI === null;
    case "WildcardNamespace":
      return true;
  }
}

function matchUniversalSelector(
  selector: UniversalSelector,
  element: Element,
): boolean {
  if (!selector.namespace) return true;

  switch (selector.namespace.type) {
    case "NamespaceName":
      return element.namespaceURI === selector.namespace.name;
    case "NoNamespace":
      return element.namespaceURI === null;
    case "WildcardNamespace":
      return true;
  }
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

  if (selector.namespace) {
    switch (selector.namespace.type) {
      case "NamespaceName":
        return element.hasAttributeNS(selector.namespace.name, selector.name);
      case "NoNamespace":
        return element.hasAttributeNS(null, selector.name);
      case "WildcardNamespace": {
        // challenge O(1) matching
        // This matches if there is no prefix
        if (element.hasAttribute(selector.name)) return true;

        for (const attr of element.attributes) {
          if (attr.localName === selector.name) return true;
        }

        return false;
      }
    }
  }

  return element.hasAttribute(selector.name);
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
  return attrValue.includes(selectorValue);
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

type ScopingRoots = [Node, ...Node[]];

/**
 * @see https://drafts.csswg.org/selectors-4/#match-against-tree
 */
export function matchSelectorToTree(
  selector: SelectorList,
  rootElement: Node,
  scopingRoots?: ScopingRoots,
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
    if (matchSelector(selector, element, scopingRoots)) {
      selectorMatchList.push(element);
    }

    // 2. For each possible pseudo-element associated with element that is one of the pseudo-elements allowed to show up in the match list, if the result of match a selector against a pseudo-element for the pseudo-element and selector is success, add the pseudo-element to the selector match list.
  }

  // This algorithm returns a (possibly empty) list of elements.
  return selectorMatchList;
}
