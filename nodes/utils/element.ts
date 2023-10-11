import { handleAttributesChanges } from "./attr.ts";
import { isValidCustomElementName } from "../../_internals/html/custom_element.ts";
import { Namespace } from "../../_internals/infra/namespace.ts";
import { find } from "../../deps.ts";
import { preInsertNode } from "./mutation.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { toASCIILowerCase } from "../../_internals/infra/string.ts";
import { $, tree } from "../../internal.ts";
export { getQualifiedName } from "./attr.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-value
 */
export function getAttributeValue(
  element: globalThis.Element,
  localName: string,
  namespace: string | null = null,
): string {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attr is null, then return the empty string.
  if (attr === null) return "";

  // 3. Return attr’s value.
  return $(attr).value;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
 */
export function setAttribute(
  attr: globalThis.Attr,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If attr’s element is neither null nor element, throw an "InUseAttributeError" DOMException.
  if (!($(attr).element === null || $(attr).element === element)) {
    throw new DOMException(
      "The attribute is in use by another element",
      "InUseAttributeError",
    );
  }

  // 2. Let oldAttr be the result of getting an attribute given attr’s namespace, attr’s local name, and element.
  const oldAttr = getAttributeByNamespaceAndLocalName(
    $(attr).namespace,
    $(attr).localName,
    element,
  );

  // 3. If oldAttr is attr, return attr.
  if (oldAttr === attr) return attr;

  // 4. If oldAttr is non-null, then replace oldAttr with attr.
  if (oldAttr) replaceAttribute(oldAttr, attr);
  // 5. Otherwise, append attr to element.
  else appendAttribute(attr, element);

  // 6. Return oldAttr.
  return oldAttr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
 */
export function getAttributeByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. Return the attribute in element’s attribute list whose namespace is namespace and local name is localName, if any; otherwise null.
  return find(
    $(element).attributeList,
    (attribute) =>
      $(attribute).namespace === namespace &&
      $(attribute).localName === localName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-append
 */
export function appendAttribute(
  attribute: globalThis.Attr,
  element: globalThis.Element,
): void {
  // 1. Append attribute to element’s attribute list.
  $(element).attributeList.append(attribute);

  // 2. Set attribute’s element to element.
  $(attribute).element = element;

  // 3. Handle attribute changes for attribute with element, null, and attribute’s value.
  handleAttributesChanges(attribute, element, null, $(attribute).value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-replace
 */
export function replaceAttribute(
  oldAttr: globalThis.Attr,
  newAttr: globalThis.Attr,
): void {
  const oldElement = $(oldAttr).element;
  // 1. Replace oldAttr by newAttr in oldAttr’s element’s attribute list.
  oldElement && $(oldElement).attributeList.replace(
    newAttr,
    (attr) => attr === oldAttr,
  );

  // 2. Set newAttr’s element to oldAttr’s element.
  $(newAttr).element = $(oldAttr).element;

  // 3. Set oldAttr’s element to null.
  $(oldAttr).element = null;

  const element = $(newAttr).element;
  // 4. Handle attribute changes for oldAttr with newAttr’s element, oldAttr’s value, and newAttr’s value.
  element &&
    handleAttributesChanges(
      oldAttr,
      element,
      $(oldAttr).value,
      $(newAttr).value,
    );
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove
 */
export function removeAttribute(attribute: globalThis.Attr): void {
  // Unclear whether there is always a element in attribute.
  // 1. Let element be attribute’s element.
  const element = $(attribute).element;

  // 2. Remove attribute from element’s attribute list.
  element && $(element).attributeList.remove((attr) => attr === attribute);

  // 3. Set attribute’s element to null.
  $(attribute).element = null;

  // 4. Handle attribute changes for attribute with element, attribute’s value, and null.
  element &&
    handleAttributesChanges(attribute, element, $(attribute).value, null);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
 */
export function removeAttributeByName(
  qualifiedName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. Let attr be the result of getting an attribute given qualifiedName and element.
  const attr = getAttributeByName(qualifiedName, element);

  // 2. If attr is non-null, then remove attr.
  if (attr) removeAttribute(attr);

  // 3. Return attr.
  return attr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
 */
export function removeAttributeByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attr is non-null, then remove attr.
  if (attr) removeAttribute(attr);

  // 3. Return attr.
  return attr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
 */
export function getAttributeByName(
  qualifiedName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If element is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
  if (
    $(element).namespace === Namespace.HTML &&
    $($(element).nodeDocument).type !== "xml"
  ) qualifiedName = toASCIILowerCase(qualifiedName);

  // 2. Return the first attribute in element’s attribute list whose qualified name is qualifiedName; otherwise null.
  return find(
    $(element).attributeList,
    (attribute) => $(attribute).qualifiedName === qualifiedName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-custom
 */
export function isCustom(element: globalThis.Element): boolean {
  // An element whose custom element state is "custom
  return $(element).customElementState === "custom";
}

export const reflectGet = getAttributeValue;

export function hasAttributeByQualifiedName(
  qualifiedName: string,
  element: globalThis.Element,
): boolean {
  for (const attr of $(element).attributeList) {
    if ($(attr).qualifiedName === qualifiedName) return true;
  }

  return false;
}

/**
 * @throws {DOMException}
 * @see https://dom.spec.whatwg.org/#insert-adjacent
 */
export function insertAdjacent(
  element: globalThis.Element,
  where: string,
  node: globalThis.Node,
): globalThis.Node | null {
  // run the steps associated with the first ASCII case-insensitive match for where:
  switch (toASCIILowerCase(where)) {
    case "beforebegin": {
      const parent = tree.parent(element);
      // If element’s parent is null, return null.
      if (!parent) return null;

      // Return the result of pre-inserting node into element’s parent before element.
      return preInsertNode(node, parent, element);
    }
    case "afterbegin": {
      // Return the result of pre-inserting node into element before element’s first child.
      return preInsertNode(node, element, tree.firstChild(element));
    }
    case "beforeend": {
      // Return the result of pre-inserting node into element before null.
      return preInsertNode(node, element, null);
    }
    case "afterend": {
      const parent = tree.parent(element);
      // If element’s parent is null, return null.
      if (!parent) return null;

      // Return the result of pre-inserting node into element’s parent before element’s next sibling.
      return preInsertNode(node, parent, tree.nextSibling(element));
    }
    default:
      // Throw a "SyntaxError" DOMException.
      throw new DOMException("<message>", DOMExceptionName.SyntaxError);
  }
}

const validShadowHostTagName = new Set<string>([
  "article",
  "aside",
  "blockquote",
  "body",
  "div",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "main",
  "nav",
  "p",
  "section",
  "span",
]);

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#valid-shadow-host-name)
 */
export function isValidShadowHostName(name: string) {
  // - a valid custom element name
  // - "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "main", "nav", "p", "section", or "span"
  return isValidCustomElementName(name) || validShadowHostTagName.has(name);
}
