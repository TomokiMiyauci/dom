import type { IHTMLProgressElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLProgressElement")
export class HTMLProgressElement extends HTMLElement
  implements IHTMLProgressElement {
  get labels(): NodeListOf<HTMLLabelElement> {
    throw new Error("labels#getter");
  }

  set width(value: number) {
    throw new Error("width#setter");
  }

  get position(): number {
    throw new Error("position#getter");
  }

  get max(): number {
    throw new Error("max#getter");
  }

  set max(value: number) {
    throw new Error("max#setter");
  }

  get value(): number {
    throw new Error("value#getter");
  }

  set value(value: number) {
    throw new Error("value#setter");
  }
}
