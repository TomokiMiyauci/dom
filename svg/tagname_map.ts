import { SVGAElement } from "./elements/svg_a_element.ts";
import { SVGElement } from "./elements/svg_element.ts";
import { Namespace } from "../infra/namespace.ts";

export const tagNameMap: Record<string, typeof SVGElement> = {
  a: SVGAElement,
};

interface InterfaceResolver {
  readonly namespace: Namespace;
  resolve(name: string): typeof SVGElement;
}

export const SVGInterfaceResolver: InterfaceResolver = {
  namespace: Namespace.SVG,
  resolve(name: string): typeof SVGElement {
    return resolveInterface(name);
  },
};

/**
 * @see https://momdo.github.io/html/dom.html#htmlelement
 */
export function resolveInterface(name: string): typeof SVGElement {
  if (name in tagNameMap) return tagNameMap[name]!;

  return SVGElement;
}
