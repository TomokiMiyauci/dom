export interface TypeSelector {
  type: "type";
  value: string;
  namespacePrefix?: string;
}

export interface UniversalSelector {
  type: "universal";
  namespacePrefix?: string;
}

export type AttributeSelector =
  & { type: "attr" }
  & (
    | Presence
    | PresenceAndValue
    | PresenceAndValueCaseSensitivity
  );

export interface Presence {
  name: string;
}

export interface PresenceAndValue extends Presence {
  value: string;
  operator: Operator;
}

export interface PresenceAndValueCaseSensitivity extends PresenceAndValue {
  case: Case;
}

export enum Operator {
  ExactEq = "=",
  OneOf = "~=",
  HyphenOf = "|=",
  StartWith = "^=",
  EndWith = "$=",
  PartOf = "*=",
  Unknown = "",
}

export namespace Operator {
  export function from(input: string): Operator {
    switch (input) {
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
}

export enum Case {
  i = "i",
  s = "s",
  Unknown = "",
}

export class IDSelector {
  type: "id" = "id";
  value: string;

  constructor(id: string) {
    this.value = id;
  }
}

export class ClassSelector {
  type: "class" = "class";
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

export type SubclassSelector = IDSelector | ClassSelector | AttributeSelector;

export type SimpleSelector =
  | TypeSelector
  | UniversalSelector
  | SubclassSelector;

/**
 * @see https://drafts.csswg.org/selectors-4/#compound
 */
export type CompoundSelector = SubclassSelector[] | [
  TypeSelector | UniversalSelector,
  ...SubclassSelector[],
];

interface BaseCombinator {
  left: CompoundSelector;
  right: CompoundSelector;
}

export interface DescendantCombinator extends BaseCombinator {
  type: "descendant";
}

export type Combinator = DescendantCombinator;

export type ComplexSelectorUnit = [CompoundSelector];

export type ComplexSelector = [ComplexSelectorUnit];

export type SelectorList = [ComplexSelector, ...ComplexSelector[]];
