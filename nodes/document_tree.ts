import { type Node } from "./node.ts";
import { type Element } from "./element.ts";
import { isElement } from "./utils.ts";

/** Return document element of document.
 * @see https://dom.spec.whatwg.org/#document-element
 */
export function getDocumentElement<T extends Node>(tree: T): Element | null {
  for (const node of tree._children) if (isElement(node)) return node;

  return null;
}
