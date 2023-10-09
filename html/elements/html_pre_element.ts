import type { IHTMLPreElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLPreElement")
export class HTMLPreElement extends HTMLElement implements IHTMLPreElement {
  get width(): number {
    throw new Error("width#getter");
  }

  set width(value: number) {
    throw new Error("width#setter");
  }
}
