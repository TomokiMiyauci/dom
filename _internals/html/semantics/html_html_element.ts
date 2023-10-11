import { HTMLElement } from "../dom/html_element.ts";
import type { IHTMLHtmlElement } from "../../../interface.d.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
 */

@Exposed("Window", "HTMLHtmlElement")
export class HTMLHtmlElement extends HTMLElement implements IHTMLHtmlElement {
  get version(): string {
    throw new Error("version#getter");
  }

  set version(value: string) {
    throw new Error("version#getter");
  }
}
