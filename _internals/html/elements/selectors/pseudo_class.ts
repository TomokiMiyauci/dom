import { isActuallyDisabled } from "../disabled_element.ts";
import { isHTMLElementOf } from "../../utils.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#selector-enabled)
 */
export function enabled(element: Element): boolean {
  // match any button, input, select, textarea, optgroup, option, fieldset element, or form-associated custom element that is not actually disabled.
  return (
    isHTMLElementOf("button", element) ||
    isHTMLElementOf("input", element) ||
    isHTMLElementOf("select", element) ||
    isHTMLElementOf("textarea", element) ||
    isHTMLElementOf("optgroup", element) ||
    isHTMLElementOf("option", element) ||
    isHTMLElementOf("fieldset", element)
    // TODO
    // form-associated custom element
  ) &&
    !isActuallyDisabled(element);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#selector-disabled)
 */
export function disabled(element: Element): boolean {
  // match any element that is actually disabled.
  return isActuallyDisabled(element);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#selector-checked)
 */
export function checked(element: Element): boolean {
  // match any element falling into one of the following categories:
  return (
    // - input elements whose type attribute is in the Checkbox state and whose checkedness state is true
    (isHTMLElementOf("input", element) &&
      element.getAttribute("type") === "checkbox" &&
      element.hasAttribute("checked")) ||
    // - input elements whose type attribute is in the Radio Button state and whose checkedness state is true
    (
      isHTMLElementOf("input", element) &&
      element.getAttribute("type") === "radio" &&
      element.hasAttribute("checked")
    ) ||
    // - option elements whose selectedness is true
    (isHTMLElementOf("option", element) && element.hasAttribute("selected"))
  );
}
