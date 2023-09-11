import { default as isPotentialCustomElementName } from "npm:is-potential-custom-element-name@1.0.1";

/**
 * [HTML Living Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-definition)
 */
export function lookUpCustomElementDefinition(
  document: Document,
  namesapce: string | null,
  localName: string | null,
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

const svgAndMathMLApplicableSpecifications = new Set<string>([
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph",
]);

/**
 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 */
export function isValidCustomElementName(name: string): boolean {
  // - name must match the PotentialCustomElementName production:
  //  PotentialCustomElementName ::= [a-z] (PCENChar)* '-' (PCENChar)*
  //  PCENChar ::= "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
  // - name must not be any of the following:
  //  - annotation-xml
  //  - color-profile
  //  - font-face
  //  - font-face-src
  //  - font-face-uri
  //  - font-face-format
  //  - font-face-name
  //  - missing-glyph
  return !svgAndMathMLApplicableSpecifications.has(name) &&
    isPotentialCustomElementName(name);
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
