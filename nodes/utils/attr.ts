import { isCustom } from "./element.ts";
import { queueMutationRecord } from "./queue.ts";
import { OrderedSet } from "../../_internals/infra/data_structures/set.ts";
import { $ } from "../../internal.ts";
import { $Attr } from "../../i.ts";
import * as $$ from "../../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#set-an-existing-attribute-value
 */
export function setExistAttributeValue(
  attribute: $Attr,
  value: string,
): void {
  // 1. If attribute’s element is null, then set attribute’s value to value.
  if (attribute[$$.element] === null) attribute[$$.value] = value;
  // 2. Otherwise, change attribute to value.
  else changeAttributes(attribute, value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-change
 */
export function changeAttributes(
  attribute: $Attr,
  value: string,
): void {
  // 1. Let oldValue be attribute’s value.
  const oldValue = attribute[$$.value];

  // 2. Set attribute’s value to value.
  attribute[$$.value] = value;

  // 3. Handle attribute changes for attribute with attribute’s element, oldValue, and value.
  if (attribute[$$.element]) {
    handleAttributesChanges(attribute, attribute[$$.element], oldValue, value);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#handle-attribute-changes
 */
export function handleAttributesChanges(
  attribute: $Attr,
  element: Element,
  oldValue: string | null,
  newValue: string | null,
): void {
  // 1. Queue a mutation record of "attributes" for element with attribute’s local name, attribute’s namespace, oldValue, « », « », null, and null.
  queueMutationRecord(
    "attributes",
    element,
    attribute[$$.localName],
    attribute[$$.namespace],
    oldValue,
    new OrderedSet(),
    new OrderedSet(),
    null,
    null,
  );

  // 2. If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, oldValue, newValue, and attribute’s namespace.
  if (isCustom(element)) throw new Error("handleAttributesChanges");

  // 3. Run the attribute change steps with element, attribute’s local name, oldValue, newValue, and attribute’s namespace.
  $(element).attributeChangeSteps.run({
    element,
    localName: attribute[$$.localName],
    oldValue,
    value: newValue,
    namespace: attribute[$$.namespace],
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-attribute-qualified-name
 */
export function getQualifiedName(
  localName: string,
  namespacePrefix: string | null,
): string {
  return strQualifiedName(localName, namespacePrefix);
}

export function qualifiedName(attr: $Attr): string {
  return getQualifiedName(attr[$$.localName], attr[$$.namespacePrefix]);
}

export function strQualifiedName(localName: string, prefix?: unknown): string {
  return typeof prefix === "string" ? `${prefix}:${localName}` : localName;
}

export function isAttr(node: Node): node is Attr {
  return node.nodeType === node.ATTRIBUTE_NODE;
}
