import { MathMLElement } from "./mathml_element.ts";

export const tagNameMap: Record<string, typeof MathMLElement> = {};

/**
 * @see https://momdo.github.io/html/dom.html#htmlelement
 */
export function resolveInterface(name: string): typeof MathMLElement {
  if (name in tagNameMap) return tagNameMap[name]!;

  return MathMLElement;
}
