import type { IHTMLQuoteElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLQuoteElement extends HTMLElement implements IHTMLQuoteElement {
  get cite(): string {
    throw new Error("cite#getter");
  }

  set cite(value: string) {
    throw new Error("cite#setter");
  }
}
