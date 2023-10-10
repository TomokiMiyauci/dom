import { iter } from "../../deps.ts";
import { isElement } from "../../dom/nodes/utils.ts";
import * as DOM from "../../internal.ts";
import { tree } from "../../internal.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/dom.html#the-title-element-2
 */
export function getTitleElement(node: Node): Element | null {
  const descendant = tree.descendants(node);
  // the first title element in the document (in tree order), if there is one, or null otherwise.
  return iter(descendant)
    .filter(isElement)
    .find((element) => DOM.$(element).localName === "title") ??
    null;
}
