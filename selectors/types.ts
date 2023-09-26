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

export type PseudoClassSelector =
  | NotPseudoClass
  | ValidityPseudoClass
  | EmptyPseudoClass;

export interface RegularPseudoClass {
  type: "pseudo-class";
  value: string;
}

export interface ValidityPseudoClass extends RegularPseudoClass {
  value: "valid" | "invalid";
}

export interface EmptyPseudoClass extends RegularPseudoClass {
  value: "empty";
}

export interface NotPseudoClass extends RegularPseudoClass {
  value: "not";
  argument: CompoundSelector;
}

export interface FunctionalPseudoClass extends RegularPseudoClass {
  arg: string;
}

export type SubclassSelector =
  | IDSelector
  | ClassSelector
  | AttributeSelector
  | PseudoClassSelector;

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

export interface DescendantCombinator {
  type: "descendant";
}

export interface ChildCombinator {
  type: "child";
}

export type Combinator = DescendantCombinator | ChildCombinator | {
  type: "unknown";
};

export namespace Combinator {
  export function from(input: string): Combinator {
    console.log(input);
    switch (input) {
      case ">": {
        return { type: "child" };
      }

      default:
        return { type: "unknown" };
    }
  }
}

export type ComplexSelectorUnit = [CompoundSelector];

export interface ComplexSelectorUnitWithCombinator {
  unit: ComplexSelectorUnit;
  combinator: Combinator;
}

export type ComplexSelector = [
  ...ComplexSelectorUnitWithCombinator[],
  ComplexSelectorUnit,
];

export type SelectorList = [ComplexSelector, ...ComplexSelector[]];
