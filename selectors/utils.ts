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
  ComplexSelector,
  ComplexSelectorUnit,
  CompoundSelector,
  IDSelector,
  Operator,
  SelectorList,
  TypeSelector,
  UniversalSelector,
} from "./types.ts";

export function selectorToSelectorList(selector: AstSelector): SelectorList {
  return selector.rules.map(astRuleToComplexSelector) as SelectorList;
}

function astRuleToComplexSelector(rule: AstRule): ComplexSelector {
  const compoundSelector: CompoundSelector = rule.tag ? [tag(rule.tag)] : [];

  if (rule.ids) {
    const selectors: IDSelector[] = rule.ids.map(id);
    compoundSelector.push(...selectors);
  }

  if (rule.attributes) {
    const selectors: AttributeSelector[] = rule.attributes.map(attr);

    compoundSelector.push(...selectors);
  }

  const xx: ComplexSelectorUnit = [compoundSelector];
  const x: ComplexSelector = [xx];

  return x;
}

function typeSelector(name: string): TypeSelector {
  return { type: "type", name };
}

function tag(
  tag: AstTagName | AstWildcardTag,
): UniversalSelector | TypeSelector {
  switch (tag.type) {
    case "TagName":
      return typeSelector(tag.name);
    case "WildcardTag":
      return { type: "universal" };
  }
}

function id(id: string): IDSelector {
  return { type: "id", id };
}

function attr(ast: AstAttribute): AttributeSelector {
  const { name, caseSensitivityModifier } = ast;
  const base = { type: "attr", name } as const;

  if (ast.operator) {
    if (!ast.value) throw new Error("invalid");

    const value = valueToStr(ast.value);
    const operator = operatorToSymbol(ast.operator);

    const base_ = { ...base, operator, value };

    if (caseSensitivityModifier) {
      return {
        ...base_,
        case: caseSensitivityModifierToCase(caseSensitivityModifier),
      };
    }

    return base_;
  }

  return base;
}

function valueToStr(ast: AstString | AstSubstitution): string {
  switch (ast.type) {
    case "String":
      return ast.value;
    case "Substitution":
      return ast.name;
  }
}

function operatorToSymbol(operator: string): Operator {
  switch (operator) {
    case Operator.EndWith:
      return Operator.EndWith;
    case Operator.HyphenOf:
      return Operator.HyphenOf;
    case Operator.ExactEq:
      return Operator.ExactEq;
    case Operator.OneOf:
      return Operator.OneOf;
    case Operator.PartOf:
      return Operator.PartOf;
    case Operator.StartWith:
      return Operator.StartWith;
    default:
      return Operator.Unknown;
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
