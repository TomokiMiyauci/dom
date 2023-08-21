import type { IHTMLOutputElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLOutputElement extends HTMLElement
  implements IHTMLOutputElement {
  get defaultValue(): string {
    throw new Error("defaultValue#getter");
  }

  set defaultValue(value: string) {
    throw new Error("defaultValue#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form#getter");
  }

  get htmlFor(): DOMTokenList {
    throw new Error("htmlFor#getter");
  }

  get labels(): NodeListOf<HTMLLabelElement> {
    throw new Error("labels#getter");
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

  get value(): string {
    throw new Error("value#getter");
  }

  set value(value: string) {
    throw new Error("value#setter");
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
