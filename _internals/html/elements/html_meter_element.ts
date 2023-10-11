import type { IHTMLMeterElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLMeterElement")
export class HTMLMeterElement extends HTMLElement implements IHTMLMeterElement {
  get high(): number {
    throw new Error("high#getter");
  }
  set high(value: number) {
    throw new Error("high#setter");
  }

  get labels(): NodeListOf<HTMLLabelElement> {
    throw new Error("labels#getter");
  }

  get low(): number {
    throw new Error("low#getter");
  }
  set low(value: number) {
    throw new Error("low#setter");
  }

  get max(): number {
    throw new Error("max#getter");
  }
  set max(value: number) {
    throw new Error("max#setter");
  }

  get min(): number {
    throw new Error("min#getter");
  }
  set min(value: number) {
    throw new Error("min#setter");
  }

  get optimum(): number {
    throw new Error("optimum#getter");
  }
  set optimum(value: number) {
    throw new Error("optimum#setter");
  }

  get value(): number {
    throw new Error("value#getter");
  }
  set value(value: number) {
    throw new Error("value#setter");
  }
}
