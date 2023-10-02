/** Check the {@linkcode el} is {@linkcode HTMLElement} of {@linkcode localName}.
 */
export function isHTMLElementOf<T extends keyof HTMLElementTagNameMap>(
  localName: T,
  element: Element,
): element is HTMLElementTagNameMap[T] {
  return element.localName === localName;
}
