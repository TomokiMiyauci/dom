import type { IHTMLLabelElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLLabelElement extends HTMLElement implements IHTMLLabelElement {
  get control(): HTMLElement | null {
    throw new Error("control");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form");
  }

  get htmlFor(): string {
    throw new Error("htmlFor#getter");
  }
  set htmlFor(value: string) {
    throw new Error("htmlFor#setter");
  }
}
