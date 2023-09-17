import { SVGAElement } from "./elements/svg_a_element.ts";
import { SVGElement } from "./elements/svg_element.ts";
import { Namespace } from "../infra/namespace.ts";
import { interfaceRegistry } from "../dom/nodes/utils/create_element.ts";

export const tagNameMap: Record<string, typeof SVGElement> = {
  a: SVGAElement,
};

/**
 * @see https://momdo.github.io/html/dom.html#htmlelement
 */
export function resolveInterface(name: string): typeof SVGElement {
  if (name in tagNameMap) return tagNameMap[name]!;

  return SVGElement;
}

export function register(): void {
  interfaceRegistry.set(Namespace.SVG, resolveInterface);
}
