import type { IHTMLTableCaptionElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTableCaptionElement extends HTMLElement
  implements IHTMLTableCaptionElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
}
