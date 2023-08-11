import type { Document } from "../nodes/document.ts";

/**
 * [HTML Living Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-definition)
 */
export function lookUpCustomElementDefinition(
  document: Document,
  namesapce: string | null,
  localName: string,
  is: string | null,
): CustomElementDefinition | null {
  // 1. If namespace is not the HTML namespace, return null.

  // 2. If document's browsing context is null, return null.

  // 3. Let registry be document's relevant global object's CustomElementRegistry object.

  // 4. If there is custom element definition in registry with name and local name both equal to localName, return that custom element definition.

  // 5. If there is a custom element definition in registry with name equal to is and local name equal to localName, return that custom element definition.

  // 6. Return null.
  return null;
}

// TODO:(miyauci) Lack of properties.
/**
 * [HTML Living Standard]((https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-definition)
 */
export interface CustomElementDefinition {
  /** A [valid custom element name](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name). */
  name: string;

  /** A local name. */
  localName: string;
}
