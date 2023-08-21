import type { IHTMLDListElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLDListElement extends HTMLElement implements IHTMLDListElement {
  get compact(): boolean {
    throw new Error("compact#getter");
  }

  set compact(value: boolean) {
    throw new Error("compact#setter");
  }
}
