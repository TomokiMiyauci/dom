import { iter } from "../../../deps.ts";
import { isElement } from "../../../dom/nodes/utils.ts";
import { isHTMLElement } from "../utils.ts";
import { tree } from "../../../internal.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#language)
 */
export function determineLanguage(node: Node): string {
  const element = isElement(node) ? node : node.parentElement;

  if (!element) return "";

  const inclusiveAncestors = tree.inclusiveAncestors(element);
  const ancestor = iter(inclusiveAncestors).filter(isElement).find(
    (element) => {
      return element.hasAttribute("xml:lang") ||
        (isHTMLElement(element) && element.hasAttributeNS(null, "lang"));
    },
  );

  if (!ancestor) return "";

  if (element.hasAttribute("xml:lang")) {
    return element.getAttribute("xml:lang")!;
  }

  return element.getAttributeNS(null, "lang")!;
}
