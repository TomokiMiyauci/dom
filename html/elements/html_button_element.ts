import type { IHTMLButtonElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLButtonElement extends HTMLElement
  implements IHTMLButtonElement {
  get disabled(): boolean {
    throw new Error("disabled#getter");
  }

  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form#getter");
  }

  get formAction(): string {
    throw new Error("formAction#getter");
  }

  set formAction(value: string) {
    throw new Error("formAction#setter");
  }

  get formEnctype(): string {
    throw new Error("formEnctype#getter");
  }

  set formEnctype(value: string) {
    throw new Error("formEnctype#setter");
  }

  get formMethod(): string {
    throw new Error("formMethod#getter");
  }

  set formMethod(value: string) {
    throw new Error("formMethod#setter");
  }

  get formNoValidate(): boolean {
    throw new Error("formNoValidate#getter");
  }

  set formNoValidate(value: boolean) {
    throw new Error("formNoValidate#setter");
  }

  get formTarget(): string {
    throw new Error("formTarget#getter");
  }

  set formTarget(value: string) {
    throw new Error("formTarget#setter");
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

  get type(): "submit" | "reset" | "button" {
    throw new Error("type#getter");
  }

  set type(value: "submit" | "reset" | "button") {
    throw new Error("type#setter");
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
