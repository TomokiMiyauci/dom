import type { IHTMLParagraphElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLParagraphElement")
export class HTMLParagraphElement extends HTMLElement
  implements IHTMLParagraphElement {
  get align(): string {
    throw new Error("align#getter");
  }

  set align(value: string) {
    throw new Error("align#setter");
  }
}
