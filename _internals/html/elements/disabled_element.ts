import { isHTMLElementOf } from "../utils.ts";
import * as form from "./forms/attributes_common_to_form_control.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#concept-element-disabled)
 */
export function isActuallyDisabled(element: Element): boolean {
  // if it is one of the following:
  // - a button element that is disabled
  if (isHTMLElementOf("button", element)) return form.isDisabled(element);
  // - an input element that is disabled
  if (isHTMLElementOf("input", element)) return form.isDisabled(element);
  // - a select element that is disabled
  if (isHTMLElementOf("select", element)) return form.isDisabled(element);
  // - a textarea element that is disabled
  if (isHTMLElementOf("textarea", element)) return form.isDisabled(element);
  // - an optgroup element that has a disabled attribute
  if (isHTMLElementOf("optgroup", element)) {
    return element.hasAttribute("disabled");
  }
  // TODO
  // - an option element that is disabled
  // - a fieldset element that is a disabled fieldset
  // - a form-associated custom element that is disabled

  return false;
}
