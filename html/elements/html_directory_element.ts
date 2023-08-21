import type { IHTMLDirectoryElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLDirectoryElement extends HTMLElement
  implements IHTMLDirectoryElement {
  get compact(): boolean {
    throw new Error("compact#getter");
  }

  set compact(value: boolean) {
    throw new Error("compact#setter");
  }
}
