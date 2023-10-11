import type { IHTMLDivElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLDivElement")
export class HTMLDivElement extends HTMLElement implements IHTMLDivElement {
  get align(): string {
    throw new Error("align#getter");
  }

  set algin(value: string) {
    throw new Error("align#setter");
  }
}
