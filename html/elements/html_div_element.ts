import type { IHTMLDivElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLDivElement extends HTMLElement implements IHTMLDivElement {
  get align(): string {
    throw new Error("align#getter");
  }

  set algin(value: string) {
    throw new Error("align#setter");
  }
}
