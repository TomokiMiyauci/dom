import type { IHTMLDataElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLDataElement extends HTMLElement implements IHTMLDataElement {
  get value(): string {
    throw new Error("value#getter");
  }

  set value(value: string) {
    throw new Error("value#setter");
  }
}
