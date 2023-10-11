import { DOMTokenList } from "../../dom/sets/dom_token_list.ts";
import { Element } from "../../dom/nodes/elements/element.ts";

export function reflect<T extends Element>(
  reflectedTarget: T,
  idlAttribute: typeof DOMTokenList,
  attributeName: string,
): DOMTokenList {
  return new idlAttribute({
    element: reflectedTarget,
    localName: attributeName,
  });
}
