import {
  getAttributeByNamespaceAndLocalName,
  removeAttributeByNamespaceAndLocalName,
} from "../../dom/nodes/elements/element_utils.ts";
import { setAttributeValue } from "../../dom/nodes/utils/set_attribute_value.ts";
import { $ } from "../../internal.ts";

export function reflectGet(element: Element, name: string): boolean {
  const target = new ElementTarget(element, name);
  // 1. Let contentAttributeValue be the result of running this's get the content attribute.
  const contentAttributeValue = target.getContentAttribute();

  // 2. If contentAttributeValue is null, then return false.
  if (contentAttributeValue === null) return false;

  // 3. Return true.
  return true;
}

export function reflectSet(
  element: Element,
  name: string,
  value: boolean,
): void {
  const target = new ElementTarget(element, name);
  // 1. If the given value is false, then run this's delete the content attribute.
  if (!value) target.deleteContentAttribute();

  // 2. If the given value is true, then run this's set the content attribute with the empty string.
  target.setContentAttribute("");
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflected-target)
 */
export interface ReflectedTarget {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-element)
   */
  getElement(): Element;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#get-the-content-attribute)
   */
  getContentAttribute(): string | null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#set-the-content-attribute)
   */
  setContentAttribute(value: string): void;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#delete-the-content-attribute)
   */
  deleteContentAttribute(): void;
}

export class ElementTarget implements ReflectedTarget {
  #element: Element;
  constructor(element: Element, public name: string) {
    this.#element = element;
  }

  getElement(): Element {
    // 1. Return element.
    return this.#element;
  }

  getContentAttribute(): string | null {
    // 1. Let attribute be the result of running get an attribute by namespace and local name given null, the reflected content attribute name, and element.
    const attribute = getAttributeByNamespaceAndLocalName(
      null,
      this.name,
      this.#element,
    );

    // 2. If attribute is null, then return null.
    if (!attribute) return null;

    // 3. Return attribute's value.
    return $(attribute).value;
  }

  setContentAttribute(value: string): void {
    // 1. Set an attribute value given element, the reflected content attribute name, and value.
    setAttributeValue(this.#element, this.name, value);
  }

  deleteContentAttribute(): void {
    // 1. Remove an attribute by namespace and local name given null, the reflected content attribute name, and element.
    removeAttributeByNamespaceAndLocalName(null, this.name, this.#element);
  }
}
