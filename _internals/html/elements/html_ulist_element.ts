import type { IHTMLUListElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLUListElement")
export class HTMLUListElement extends HTMLElement implements IHTMLUListElement {
  get compact(): boolean {
    throw new Error("compact#getter");
  }
  set compact(value: boolean) {
    throw new Error("compact#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }
}
