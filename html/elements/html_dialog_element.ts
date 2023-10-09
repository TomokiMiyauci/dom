import type { IHTMLDialogElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLDialogElement")
export class HTMLDialogElement extends HTMLElement
  implements IHTMLDialogElement {
  get open(): boolean {
    throw new Error("open#getter");
  }

  set open(value: boolean) {
    throw new Error("open#setter");
  }

  get returnValue(): string {
    throw new Error("returnValue#getter");
  }

  set returnValue(value: string) {
    throw new Error("returnValue#setter");
  }
  close(returnValue?: string): void {
    throw new Error("close");
  }

  show(): void {
    throw new Error("show");
  }

  showModal(): void {
    throw new Error("showModal");
  }
}
