import type { IHTMLOptGroupElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLOptGroupElement extends HTMLElement
  implements IHTMLOptGroupElement {
  get disabled(): boolean {
    throw new Error("disabled#getter");
  }

  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get label(): string {
    throw new Error("label#getter");
  }

  set label(value: string) {
    throw new Error("label#setter");
  }
}
