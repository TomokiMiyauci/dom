import type { IHTMLLegendElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLLegendElement")
export class HTMLLegendElement extends HTMLElement
  implements IHTMLLegendElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form");
  }
}
