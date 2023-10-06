import { iter } from "../../../deps.ts";
import { isElement } from "../../../dom/nodes/utils.ts";
import { $, tree } from "../../../internal.ts";
import { UserNavigationInvolvement } from "../../loading_web_pages/navigation_and_session_histories/navigation.ts";
import { isHTMLElement, isHTMLElementOf } from "../../utils.ts";
import { fireEvent } from "../../../dom/events/fire.ts";

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

export type FormAssociatedElement =
  | HTMLButtonElement
  | HTMLFieldSetElement
  | HTMLInputElement
  | HTMLObjectElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLImageElement;
// TODO form-associated custom element

const formAssociatedElementTagNames = new Set<string>([
  "button",
  "fieldset",
  "input",
  "object",
  "select",
  "textarea",
  "img",
]);

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/forms.html#form-associated-element)
 */
export function isFormAssociatedElement(
  el: HTMLElement,
): el is FormAssociatedElement {
  return formAssociatedElementTagNames.has(el.localName);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#reset-the-form-owner)
 */
export function resetFormOwner(element: FormAssociatedElement): void {
  // 1. Unset element's parser inserted flag.

  // 2. If all of the following conditions are true
  // - element's form owner is not null
  // - element is not listed or its form content attribute is not present
  // - element's form owner is its nearest form element ancestor after the change to the ancestor chain
  // then do nothing, and return.

  // 3. Set element's form owner to null.

  // 4. If element is listed, has a form content attribute, and is connected, then:

  // 1. If the first element in element's tree, in tree order, to have an ID that is identical to element's form content attribute's value, is a form element, then associate the element with that form element.

  const ancestors = tree.ancestors(element);
  const formOwner = iter(ancestors).find(isHTMLFormElement) ?? null;

  // 5. Otherwise, if element has an ancestor form element, then associate element with the nearest such ancestor form element.
  $(element).formOwner = formOwner;
}

function isHTMLFormElement(node: Node): node is HTMLFormElement {
  return isElement(node) && isHTMLElement(node) &&
    isHTMLElementOf("form", node);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-form-submit)
 */
export function submit(
  form: HTMLFormElement,
  submitter: Element,
  submittedFromSubmitMethod = false,
  userInvolvement: UserNavigationInvolvement = UserNavigationInvolvement.None,
): void {
  // 1. If form cannot navigate, then return.

  // 2. If form's constructing entry list is true, then return.

  // 3. Let form document be form's node document.

  // 4. If form document's active sandboxing flag set has its sandboxed forms browsing context flag set, then return.

  // 5. If submitted from submit() method is false, then:
  if (!submittedFromSubmitMethod) {
    // 1. If form's firing submission events is true, then return.

    // 2. Set form's firing submission events to true.

    // 3. If the submitter element's no-validate state is false, then interactively validate the constraints of form and examine the result. If the result is negative (i.e., the constraint validation concluded that there were invalid fields and probably informed the user of this), then:

    // 1. Set form's firing submission events to false.

    // 2. Return.

    // 4. Let submitterButton be null if submitter is form. Otherwise, let submitterButton be submitter.
    const submitterButton = submitter === form ? null : submitter;

    // 5. Let shouldContinue be the result of firing an event named submit at form using SubmitEvent,
    // TODO use SubmitEvent
    const shouldContinue = fireEvent("submit", form, undefined, (event) => {
      // with the submitter attribute initialized to submitterButton, the bubbles attribute initialized to true, and the cancelable attribute initialized to true.
      // TODO
      $(event).bubbles = true, $(event).cancelable = true;
    });

    // 6. Set form's firing submission events to false.

    // 7. If shouldContinue is false, then return.

    // 8. If form cannot navigate, then return.
  }

  // 6. Let encoding be the result of picking an encoding for the form.

  // 7. Let entry list be the result of constructing the entry list with form, submitter, encoding, and true.

  // 8. Assert: entry list is not null.

  // 9. If form cannot navigate, then return.

  // 10. Let method be the submitter element's method.

  // 11. If method is dialog, then:

  // 1. If form does not have an ancestor dialog element, then return.

  // 2. Let subject be form's nearest ancestor dialog element.

  // 3. Let result be null.

  // 4. If submitter is an input element whose type attribute is in the Image Button state, then:

  // 1. Let (x, y) be the selected coordinate.

  // 2. Set result to the concatenation of x, ",", and y.

  // 5. Otherwise, if submitter has a value, then set result to that value.

  // 6. Close the dialog subject with result.

  // 7. Return.

  // 12. Let action be the submitter element's action.

  // 13. If action is the empty string, let action be the URL of the form document.

  // 14. Let parsed action be the result of encoding-parsing a URL given action, relative to submitter's node document.

  // 15. If parsed action is failure, then return.

  // 16. Let scheme be the scheme of parsed action.

  // 17. Let enctype be the submitter element's enctype.

  // 18. Let formTarget be null.

  // 19. If the submitter element is a submit button and it has a formtarget attribute, then set formTarget to the formtarget attribute value.

  // 20. Let target be the result of getting an element's target given submitter's form owner and formTarget.

  // 21. Let noopener be the result of getting an element's noopener with form and target.

  // 22. Let targetNavigable be the first return value of applying the rules for choosing a navigable given target, form's node navigable, and noopener.

  // 23. If targetNavigable is null, then return.

  // 24. Let historyHandling be "auto".

  // 25. If form document equals targetNavigable's active document, and form document has not yet completely loaded, then set historyHandling to "replace".

  // 26. Select the appropriate row in the table below based on scheme as given by the first cell of each row. Then, select the appropriate cell on that row based on method as given in the first cell of each column. Then, jump to the steps named in that cell and defined below the table.
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-form-reset)
 */
export function reset(element: HTMLFormElement): void {
  // 1. Let reset be the result of firing an event named reset at form, with the bubbles and cancelable attributes initialized to true.

  // 2. If reset is true, then invoke the reset algorithm of each resettable element whose form owner is form.
}
