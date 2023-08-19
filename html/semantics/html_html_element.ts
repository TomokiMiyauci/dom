import { HTMLElement } from "../dom/html_element.ts";
import type { IHTMLHtmlElement } from "../../interface.d.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement
 */
export class HTMLHtmlElement extends HTMLElement implements IHTMLHtmlElement {
  get version(): string {
    throw new Error("version#getter");
  }

  set version(value: string) {
    throw new Error("version#getter");
  }
}
