import { isValidCustomElementName } from "../custom_element.ts";
import { HTMLHtmlElement } from "../semantics/html_html_element.ts";
import { HTMLHeadElement } from "../semantics/html_head_element.ts";
import { HTMLTitleElement } from "../semantics/html_title_element.ts";
import { HTMLUnknownElement } from "./html_unknown_element.ts";
import { HTMLBodyElement } from "../elements/html_body_element.ts";
import { Namespace } from "../../infra/namespace.ts";
import { type Element } from "../../nodes/element.ts";
import { HTMLElement } from "./html_element.ts";

const unknowns = new Set<string>([
  "applet",
  "bgsound",
  "blink",
  "isindex",
  "keygen",
  "multicol",
  "nextid",
  "spacer",
]);
const knowns = new Set<string>([
  "acronym",
  "basefont",
  "big",
  "center",
  "nobr",
  "noembed",
  "noframes",
  "plaintext",
  "rb",
  "rtc",
  "strike",
  "tt",
]);

const preElements = new Set<string>(["listing", "xmp"]);

interface InterfaceResolver {
  readonly namespace: Namespace;
  resolve(name: string): typeof Element;
}

export const HTMLInterfaceResolver: InterfaceResolver = {
  namespace: Namespace.HTML,
  resolve(name: string): typeof Element {
    return resolveInterface(name);
  },
};

const tagNameMap: Record<string, typeof HTMLElement> = {
  html: HTMLHtmlElement,
  head: HTMLHeadElement,
  title: HTMLTitleElement,
  body: HTMLBodyElement,
};

/**
 * @see https://momdo.github.io/html/dom.html#htmlelement
 */
export function resolveInterface(name: string): typeof HTMLElement {
  // 1. If name is applet, bgsound, blink, isindex, keygen, multicol, nextid, or spacer, then return HTMLUnknownElement.
  if (unknowns.has(name)) return HTMLUnknownElement;

  // 2. If name is acronym, basefont, big, center, nobr, noembed, noframes, plaintext, rb, rtc, strike, or tt, then return HTMLElement.
  if (knowns.has(name)) return HTMLElement;

  // 3. If name is listing or xmp, then return HTMLPreElement.
  if (preElements.has(name)) throw new Error();
  // 4. Otherwise, if this specification defines an interface appropriate for the element type corresponding to the local name name, then return that interface.
  else if (tagNameMap[name]) return tagNameMap[name]!;

  // 5. If other applicable specifications define an appropriate interface for name, then return the interface they define.

  // 6. If name is a valid custom element name, then return HTMLElement.
  if (isValidCustomElementName(name)) return HTMLElement;

  // 7. Return HTMLUnknownElement.
  return HTMLUnknownElement;
}
