/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/parsing.html#parsing)
 * @module
 */

import { createElement } from "../../../nodes/utils/create_element.ts";
import { $ } from "../../../internal.ts";
import { isFormAssociatedElement } from "../elements/forms/attributes_common_to_form_control.ts";
import { isHTMLElement } from "../utils.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token)
 */
export function createElementForToken(
  token: { name: string; attributes: Attr[] },
  namespace: string | null,
  document: Document,
  // parent: Node,
  // Non-standard
  context: {
    fromElementPointer: HTMLFormElement | null;
  },
): Element {
  // 1. If the active speculative HTML parser is not null, then return the result of creating a speculative mock element given given namespace, the tag name of the given token, and the attributes of the given token.

  // 2. Otherwise, optionally create a speculative mock element given given namespace, the tag name of the given token, and the attributes of the given token.

  // 3. Let document be intended parent's node document.
  // const document = $(parent).nodeDocument;

  // 4. Let local name be the tag name of the token.
  const localName = token.name;

  // 5. Let is be the value of the "is" attribute in the given token, if such an attribute exists, or null otherwise.
  const is = token.attributes.find((attr) => attr.name === "is")?.value ?? null;

  // 6. Let definition be the result of looking up a custom element definition given document, given namespace, local name, and is.

  // 7. If definition is non-null and the parser was not created as part of the HTML fragment parsing algorithm, then let will execute script be true. Otherwise, let it be false.

  // 1. If will execute script is true, then:

  // 2. Increment document's throw-on-dynamic-markup-insertion counter.

  // 3. If the JavaScript execution context stack is empty, then perform a microtask checkpoint.

  // 8. Push a new element queue onto document's relevant agent's custom element reactions stack.

  // 9. Let element be the result of creating an element given document, localName, given namespace, null, and is. If will execute script is true, set the synchronous custom elements flag; otherwise, leave it unset.
  const element = createElement(document, localName, namespace, null, is);

  // 10. Append each attribute in the given token to element.
  token.attributes.forEach(element.setAttributeNode.bind(element));

  // 11. If will execute script is true, then:

  // 1. Let queue be the result of popping from document's relevant agent's custom element reactions stack. (This will be the same element queue as was pushed above.)

  // 2. Invoke custom element reactions in queue.

  // 3. Decrement document's throw-on-dynamic-markup-insertion counter.

  // 12. If element has an xmlns attribute in the XMLNS namespace whose value is not exactly the same as the element's namespace, that is a parse error. Similarly, if element has an xmlns:xlink attribute in the XMLNS namespace whose value is not the XLink Namespace, that is a parse error.

  // 13. If element is a resettable element, invoke its reset algorithm. (This initializes the element's value and checkedness based on the element's attributes.)

  // 14. If element is a form-associated element and not a form-associated custom element, the form element pointer is not null, there is no template element on the stack of open elements, element is either not listed or doesn't have a form attribute, and the intended parent is in the same tree as the element pointed to by the form element pointer, then associate element with the form element pointed to by the form element pointer and set element's parser inserted flag.
  // TODO
  if (isHTMLElement(element) && isFormAssociatedElement(element)) {
    if (!$(element).formOwner) {
      $(element).formOwner = context.fromElementPointer;
    }
  }

  // 15. Return element.
  return element;
}
