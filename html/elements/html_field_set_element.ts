import type { IHTMLFieldSetElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLFieldSetElement extends HTMLElement
  implements IHTMLFieldSetElement {
  get disabled(): boolean {
    throw new Error("disabled#getter");
  }

  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get elements(): HTMLCollection {
    throw new Error("elements#getter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form#getter");
  }

  get name(): string {
    throw new Error("name#getter");
  }

  set name(value: string) {
    throw new Error("name#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }

  get validationMessage(): string {
    throw new Error("validationMessage#getter");
  }

  get validity(): ValidityState {
    throw new Error("validity#getter");
  }

  get willValidate(): boolean {
    throw new Error("willValidate#getter");
  }

  checkValidity(): boolean {
    throw new Error("checkValidity");
  }

  reportValidity(): boolean {
    throw new Error("reportValidity");
  }

  setCustomValidity(error: string): void {
    throw new Error("setCustomValidity");
  }
}
