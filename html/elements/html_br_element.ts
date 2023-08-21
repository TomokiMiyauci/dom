import type { IHTMLBRElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLBRElement extends HTMLElement implements IHTMLBRElement {
  get clear(): string {
    throw new Error("clear#getter");
  }

  set clear(value: string) {
    throw new Error("clear#setter");
  }
}
