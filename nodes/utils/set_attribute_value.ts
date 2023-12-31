import { Attr } from "../attr.ts";
import {
  appendAttribute,
  getAttributeByNamespaceAndLocalName,
} from "./element.ts";
import { changeAttributes } from "./attr.ts";
import * as $$ from "../../symbol.ts";
import { $Element } from "../../i.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set-value
 */
export function setAttributeValue(
  element: $Element,
  localName: string,
  value: string,
  prefix: string | null = null,
  namespace: string | null = null,
): void {
  // 1. Let attribute be the result of getting an attribute given namespace, localName, and element.
  const attribute = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attribute is null, create an attribute whose namespace is namespace, namespace prefix is prefix, local name is localName, value is value, and node document is element’s node document, then append this attribute to element, and then return.
  if (attribute === null) {
    const attr: Attr = Reflect.construct(Attr, []);
    attr[$$.namespace] = namespace,
      attr[$$.namespacePrefix] = prefix,
      attr[$$.localName] = localName,
      attr[$$.value] = value,
      attr[$$.nodeDocument] = element[$$.nodeDocument];

    appendAttribute(attr, element);
    return;
  }
  // 3. Change attribute to value.
  changeAttributes(attribute, value);
}

export const reflectSet = setAttributeValue;
