import {
  AstAttribute,
  AstRule,
  AstSelector,
  AstString,
  AstSubstitution,
  AstTagName,
  AstWildcardTag,
} from "npm:css-selector-parser@2.3.2";
import {
  AttributeSelector,
  Case,
  ClassSelector,
  Combinator,
  ComplexSelector,
  ComplexSelectorUnitWithCombinator,
  CompoundSelector,
  IDSelector,
  NotPseudoClass,
  Operator,
  PseudoClassSelector,
  SelectorList,
  TypeSelector,
  UniversalSelector,
} from "./types.ts";
import { initLast } from "../deps.ts";

export function selectorToSelectorList(selector: AstSelector): SelectorList {
  return selector.rules.map(toComplexSelector) as SelectorList;
}

export function toComplexSelector(rule: AstRule): ComplexSelector {
  const flatted = flatten(rule);
  const normalized = shiftCombinator(flatted);
  const [inits, last] = initLast(normalized);

  const withCombinator = inits.map(toComplexSelectorUnitWithCombinator);

  return [...withCombinator, [toCompoundSelector(last)]];
}

export function toComplexSelectorUnitWithCombinator(
  { combinator, ...rest }: AstRule & { combinator: string },
): ComplexSelectorUnitWithCombinator {
  return {
    combinator: Combinator.from(combinator),
    unit: [toCompoundSelector(rest)],
  };
}

export type FlattenAstRule = [AstRule, ...(AstRule & { combinator: string })[]];
export type NormalizedAstRules = [
  ...(AstRule & { combinator: string })[],
  AstRule,
];

export function flatten(rule: AstRule): FlattenAstRule {
  const rules: FlattenAstRule = [rule];

  while (rule.nestedRule) {
    rules.push(rule.nestedRule);

    rule = rule.nestedRule;
  }

  return rules;
}

export function shiftCombinator(rules: FlattenAstRule): NormalizedAstRules {
  const shifted = rules.reduce((acc, cur, index, array) => {
    const next = array[index + 1];

    if (next) {
      return acc.concat({
        ...cur,
        combinator: next.combinator ?? "",
      }) as NormalizedAstRules;
    }

    const { combinator: _, ...rest } = cur;

    return acc.concat(rest) as NormalizedAstRules;
  }, [] as unknown as NormalizedAstRules);

  return shifted;
}

function toCompoundSelector(rule: AstRule): CompoundSelector {
  const compoundSelector: CompoundSelector = rule.tag ? [tag(rule.tag)] : [];

  if (rule.ids) {
    const selectors: IDSelector[] = rule.ids.map(id);
    compoundSelector.push(...selectors);
  }

  if (rule.attributes) {
    const selectors: AttributeSelector[] = rule.attributes.map(attr);

    compoundSelector.push(...selectors);
  }

  if (rule.classNames) {
    const selectors: ClassSelector[] = rule.classNames.map((value) => ({
      type: "class",
      value,
    }));

    compoundSelector.push(...selectors);
  }

  if (rule.pseudoClasses) {
    const selectors: PseudoClassSelector[] = rule.pseudoClasses.map(
      (pseudo) => {
        const { name, argument } = pseudo;
        switch (name) {
          case "valid":
          case "invalid":
          case "empty":
          case "first-child":
          case "last-child":
          case "scope":
          case "disabled":
          case "enabled":
            return { type: "pseudo-class", value: name };

          case "not": {
            const selectorList = selectorToSelectorList(
              argument! as AstSelector,
            );
            const arg = selectorList.flat(3);
            return <NotPseudoClass> {
              type: "pseudo-class",
              value: name,
              argument: arg,
            };
          }

          case "nth-child": {
            const selector = argument?.type === "Formula" ? argument : (() => {
              throw new Error();
            })();

            return { type: "pseudo-class", value: name, argument: selector };
          }

          case "nth-last-child": {
            const selector = argument?.type === "Formula" ? argument : (() => {
              throw new Error();
            })();

            return { type: "pseudo-class", value: name, argument: selector };
          }
        }

        throw new Error("");
      },
    );

    compoundSelector.push(...selectors);
  }

  return compoundSelector;
}

function typeSelector(value: string): TypeSelector {
  return { type: "type", value };
}

function tag(
  tag: AstTagName | AstWildcardTag,
): UniversalSelector | TypeSelector {
  const base = { namespace: tag.namespace };
  switch (tag.type) {
    case "TagName":
      return { ...typeSelector(tag.name), ...base };
    case "WildcardTag":
      return { type: "universal", ...base };
  }
}

export function id(id: string): IDSelector {
  return { type: "id", value: id };
}

export function attr(ast: AstAttribute): AttributeSelector {
  const { name, caseSensitivityModifier, namespace } = ast;
  const base = { type: "attr", name, namespace } as const;

  if (typeof ast.operator !== "string" && !ast.value) {
    return base;
  }

  if (typeof ast.operator !== "string" || !ast.value) {
    throw new Error("unreachable");
  }

  const value = valueToStr(ast.value);
  const operator = Operator.from(ast.operator);
  const base_ = { ...base, operator, value };

  if (caseSensitivityModifier) {
    return {
      ...base_,
      case: caseSensitivityModifierToCase(caseSensitivityModifier),
    };
  }

  return base_;
}

function valueToStr(ast: AstString | AstSubstitution): string {
  switch (ast.type) {
    case "String":
      return ast.value;
    case "Substitution":
      return ast.name;
  }
}

function caseSensitivityModifierToCase(caseSensitivityModifier: string): Case {
  switch (caseSensitivityModifier) {
    case Case.i:
      return Case.i;
    case Case.s:
      return Case.s;
    default:
      return Case.Unknown;
  }
}
