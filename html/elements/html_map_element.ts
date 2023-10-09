import type { IHTMLMapElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLMapElement")
export class HTMLMapElement extends HTMLElement implements IHTMLMapElement {
  get areas(): HTMLCollection {
    throw new Error("areas");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }
}
