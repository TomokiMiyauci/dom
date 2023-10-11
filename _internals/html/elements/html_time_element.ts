import type { IHTMLTimeElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTimeElement")
export class HTMLTimeElement extends HTMLElement implements IHTMLTimeElement {
  get dateTime(): string {
    throw new Error("dateTime#getter");
  }
  set dateTime(value: string) {
    throw new Error("dateTime#setter");
  }
}
