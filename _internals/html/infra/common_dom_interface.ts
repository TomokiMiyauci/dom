import {
  getAttributeByNamespaceAndLocalName,
  removeAttributeByNamespaceAndLocalName,
} from "../../../nodes/utils/element.ts";
import { setAttributeValue } from "../../../nodes/utils/set_attribute_value.ts";
import { $ } from "../../../internal.ts";

export function reflectGet(
  type: "DOMString",
  element: Element,
  name: string,
): string;
export function reflectGet(
  type: "boolean",
  element: Element,
  name: string,
): boolean;
export function reflectGet(
  type: "boolean" | "DOMString",
  element: Element,
  name: string,
): boolean | string {
  const IDLAttribute = type === "boolean" ? BooleanIDL : DOMStringIDL;
  const target = new ElementTarget(element, name);
  const idl = new IDLAttribute(target);

  return idl.value;
}

export function reflectSet(
  element: Element,
  name: string,
  value: boolean | string,
): void {
  const IDLAttribute = typeof value === "boolean" ? BooleanIDL : DOMStringIDL;
  const target = new ElementTarget(element, name);
  const idl = new IDLAttribute(target);

  idl.value = value;
}

interface IDLAttribute<in out T> {
  get value(): T;
  set value(value: T);
}

class DOMStringIDL implements IDLAttribute<string> {
  constructor(public target: ReflectedTarget) {}
  get value(): string {
    // 1. Let element be the result of running this's get the element.
    const element = this.target.getElement();

    // 2. Let contentAttributeValue be the result of running this's get the content attribute.
    const contentAttributeValue = this.target.getContentAttribute();

    // 3. Let attributeDefinition be the attribute definition of element's content attribute whose namespace is null and local name is the reflected content attribute name.

    // 4. If attributeDefinition indicates it is an enumerated attribute and the reflected IDL attribute is defined to be limited to only known values:

    // 1. If contentAttributeValue does not correspond to any state of attributeDefinition (e.g., it is null and there is no missing value default), or that it is in a state of attributeDefinition with no associated keyword value, then return the empty string.

    // 2. Return the canonical keyword for the state of attributeDefinition that contentAttributeValue corresponds to.

    // 5. If contentAttributeValue is null, then return the empty string.
    if (contentAttributeValue === null) return "";

    // 6. Return contentAttributeValue.
    return contentAttributeValue;
  }

  set value(value: string) {
    // run this's set the content attribute with the given value.
    this.target.setContentAttribute(value);
  }
}

class BooleanIDL implements IDLAttribute<boolean> {
  constructor(public target: ReflectedTarget) {}

  get value() {
    // 1. Let contentAttributeValue be the result of running this's get the content attribute.
    const contentAttributeValue = this.target.getContentAttribute();

    // 2. If contentAttributeValue is null, then return false.
    if (contentAttributeValue === null) return false;

    // 3. Return true.
    return true;
  }

  set value(value: boolean) {
    // 1. If the given value is false, then run this's delete the content attribute.
    if (!value) this.target.deleteContentAttribute();
    // 2. If the given value is true, then run this's set the content attribute with the empty string.
    else this.target.setContentAttribute("");
  }
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
