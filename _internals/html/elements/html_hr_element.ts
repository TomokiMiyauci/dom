import type { IHTMLHRElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLHRElement")
export class HTMLHRElement extends HTMLElement implements IHTMLHRElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
  get color(): string {
    throw new Error("color#getter");
  }
  set color(value: string) {
    throw new Error("color#setter");
  }
  get noShade(): boolean {
    throw new Error("noShade#getter");
  }
  set noShade(value: boolean) {
    throw new Error("noShade#setter");
  }
  get size(): string {
    throw new Error("size#getter");
  }
  set size(value: string) {
    throw new Error("size#setter");
  }
  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }
}
