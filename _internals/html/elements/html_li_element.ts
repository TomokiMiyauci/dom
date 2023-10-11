import type { IHTMLLIElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLLIElement")
export class HTMLLIElement extends HTMLElement implements IHTMLLIElement {
  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }

  get value(): number {
    throw new Error("value#getter");
  }
  set value(value: number) {
    throw new Error("value#setter");
  }
}
