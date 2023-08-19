import { HTMLElement } from "../dom/html_element.ts";
import type { IHTMLTitleElement } from "../../interface.d.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
 */
export class HTMLTitleElement extends HTMLElement implements IHTMLTitleElement {
  get text(): string {
    throw new Error("text#getter");
  }

  set text(value: string) {
    throw new Error("text#setter");
  }
}
