import type { IHTMLHeadingElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLHeadingElement extends HTMLElement
  implements IHTMLHeadingElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
}
