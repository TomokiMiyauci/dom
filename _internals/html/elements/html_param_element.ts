import type { IHTMLParamElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLParamElement")
export class HTMLParamElement extends HTMLElement implements IHTMLParamElement {
  get name(): string {
    throw new Error("name#getter");
  }

  set name(value: string) {
    throw new Error("name#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }

  set type(value: string) {
    throw new Error("type#setter");
  }

  get value(): string {
    throw new Error("value#getter");
  }

  set value(value: string) {
    throw new Error("value#setter");
  }

  get valueType(): string {
    throw new Error("valueType#getter");
  }

  set valueType(value: string) {
    throw new Error("valueType#setter");
  }
}
