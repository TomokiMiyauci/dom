export interface TypeSelector {
  type: "type";
  name: string;
  namespacePrefix?: string;
}

export interface UniversalSelector {
  type: "universal";
  namespacePrefix?: string;
}

export type AttributeSelector = {
  type: "attr";
} & (Presence | PresenceAndValue | PresenceAndValueCaseSensitivity);

interface Presence {
  name: string;
}

interface PresenceAndValue extends Presence {
  value: string;
  operator: Operator;
}

interface PresenceAndValueCaseSensitivity extends PresenceAndValue {
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

export enum Case {
  i = "i",
  s = "s",
  Unknown = "",
}

export interface IDSelector {
  type: "id";
  id: string;
}

export interface ClassSelector {
  type: "class";
  value: string;
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
