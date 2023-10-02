import { isHTMLElementOf } from "../../utils.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-disabled)
 */
export function isDisabled(element: Element): boolean {
  // if any of the following are true:
  if (
    // - the element is a button,
    (isHTMLElementOf("button", element) ||
      // input, select, textarea,
      isHTMLElementOf("input", element) ||
      isHTMLElementOf("select", element) ||
      isHTMLElementOf("textarea", element)) &&
    // or form-associated custom element,
    // and the disabled attribute is specified on this element (regardless of its value); or
    element.hasAttribute("disabled")
  ) return true;

  // TODO
  // - the element is a descendant of a fieldset element whose disabled attribute is specified, and is not a descendant of that fieldset element's first legend element child, if any.

  return false;
}
