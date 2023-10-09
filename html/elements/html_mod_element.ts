import type { IHTMLModElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLModElement")
export class HTMLModElement extends HTMLElement implements IHTMLModElement {
  get cite(): string {
    throw new Error("cite#getter");
  }
  set cite(value: string) {
    throw new Error("cite#setter");
  }

  get dateTime(): string {
    throw new Error("dateTime#getter");
  }
  set dateTime(value: string) {
    throw new Error("dateTime#setter");
  }
}
