import type { IHTMLButtonElement } from "../../interface.d.ts";
import { $ } from "../../../internal.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { reflectGet, reflectSet } from "../infra/common_dom_interface.ts";
import {
  isDisabled,
  reset,
  submit,
} from "./forms/attributes_common_to_form_control.ts";
import { userNavigationInvolvement } from "../loading_web_pages/navigation_and_session_histories/navigation.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLButtonElement")
export class HTMLButtonElement extends HTMLElement
  implements IHTMLButtonElement {
  constructor() {
    super();

    this.#_.activationBehavior = (event) => {
      // 1. If element is disabled, then return.
      if (isDisabled(this)) return;

      // 2. If element's node document is not fully active, then return.

      // 3. If element has a form owner then switch on element's type attribute's state, then:
      if (this.#_.formOwner) {
        switch (this.type) {
          // Submit Button
          case "submit": {
            // Submit element's form owner from element with userInvolvement set to event's user navigation involvement.
            submit(
              this.#_.formOwner,
              this,
              undefined,
              userNavigationInvolvement(event),
            );
            break;
          }

          // Reset Button
          case "reset": {
            // Reset element's form owner.
            reset(this.#_.formOwner);
            break;
          }

          // Button
          case "button": {
            // Do nothing.
          }
        }
      }

      // 4. Run the popover target attribute activation behavior given element.
    };
  }

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
    return reflectGet("DOMString", this, "type") as
      | "submit"
      | "reset"
      | "button";
  }

  set type(value: "submit" | "reset" | "button") {
    reflectSet(this, "type", value);
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

  get #_() {
    return $<HTMLButtonElement>(this);
  }
}
