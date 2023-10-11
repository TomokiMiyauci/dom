import type { IHTMLFontElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLFontElement")
export class HTMLFontElement extends HTMLElement implements IHTMLFontElement {
  get color(): string {
    throw new Error("color#getter");
  }
  set color(value: string) {
    throw new Error("color#setter");
  }
  get face(): string {
    throw new Error("face#getter");
  }
  set face(value: string) {
    throw new Error("face#setter");
  }
  get size(): string {
    throw new Error("size#getter");
  }
  set size(value: string) {
    throw new Error("size#setter");
  }
}
