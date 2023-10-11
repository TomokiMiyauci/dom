import { Namespace } from "../infra/namespace.ts";

/** Check the {@linkcode el} is {@linkcode HTMLElement} of {@linkcode localName}.
 */
export function isHTMLElementOf<T extends keyof HTMLElementTagNameMap>(
  localName: T,
  element: Element,
): element is HTMLElementTagNameMap[T] {
  return element.localName === localName;
}

/** Whether the {@linkcode element} is {@linkcode HTMLElement} or not. */
export function isHTMLElement(element: Element): element is HTMLElement {
  return element.namespaceURI === Namespace.HTML;
}
