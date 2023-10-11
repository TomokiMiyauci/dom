import type { IHTMLOptionElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLOptionElement")
export class HTMLOptionElement extends HTMLElement
  implements IHTMLOptionElement {
  get defaultSelected(): boolean {
    throw new Error("defaultSelected#getter");
  }

  set defaultSelected(value: boolean) {
    throw new Error("defaultSelected#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form#getter");
  }

  set form(value: HTMLFormElement | null) {
    throw new Error("form#setter");
  }

  get index(): number {
    throw new Error("index#getter");
  }

  set index(value: number) {
    throw new Error("index#setter");
  }

  get selected(): boolean {
    throw new Error("selected#getter");
  }

  set selected(value: boolean) {
    throw new Error("selected#setter");
  }

  get text(): string {
    throw new Error("text#getter");
  }

  set text(value: string) {
    throw new Error("text#setter");
  }

  get value(): string {
    throw new Error("value#getter");
  }

  set value(value: string) {
    throw new Error("value#setter");
  }

  get disabled(): boolean {
    throw new Error("disabled#getter");
  }

  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get label(): string {
    throw new Error("label#getter");
  }

  set label(value: string) {
    throw new Error("label#setter");
  }
}
