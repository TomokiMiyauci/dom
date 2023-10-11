import type { IHTMLOutputElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../../dom/sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLOutputElement")
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

  /**
   * @see https://html.spec.whatwg.org/multipage/form-elements.html#dom-output-htmlfor
   */
  @SameObject
  @PutForwards("value")
  get htmlFor(): DOMTokenList {
    // reflect the for content attribute.
    return reflect(this, DOMTokenList, "for");
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
