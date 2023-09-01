import { type Document } from "./document.ts";
import { Node, NodeStates, NodeType } from "./node.ts";
import { type PartialBy } from "../../deps.ts";
import { type Element, isCustom } from "./element.ts";
import type { IAttr } from "../../interface.d.ts";
import { getQualifiedName } from "./utils.ts";
import {
  $attributeChangeSteps,
  $element,
  $localName,
  $namespace,
  $namespacePrefix,
  $nodeDocument,
  $value,
} from "./internal.ts";
import { queueMutationRecord } from "./mutation_observer.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";

export interface AttrStates {
  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-namespace
   */
  namespace: string | null;

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-namespace-prefix
   */
  namespacePrefix: string | null;

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-local-name
   */
  localName: string;

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-value
   */
  value: string;

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-element
   */
  element: Element | null;
}

type Optional = "namespace" | "namespacePrefix" | "value" | "element";

export class Attr extends Node implements IAttr {
  [$namespace]: string | null;
  [$namespacePrefix]: string | null;
  [$localName]: string;
  [$value]: string;
  [$element]: Element | null;

  constructor(
    {
      namespace = null,
      namespacePrefix = null,
      localName,
      element = null,
      value = "",
      nodeDocument,
    }: PartialBy<AttrStates, Optional> & NodeStates,
  ) {
    super();

    this[$namespace] = namespace;
    this[$namespacePrefix] = namespacePrefix;
    this[$value] = value;
    this[$localName] = localName;
    this[$element] = element;
    this[$nodeDocument] = nodeDocument;
  }

  override [$nodeDocument]: Document;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.ATTRIBUTE_NODE {
    return NodeType.ATTRIBUTE_NODE;
  }

  override get nodeName(): string {
    return getQualifiedName(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    // this’s value.
    return this[$value];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(value: string) {
    // Set an existing attribute value with this and the given value.
    setAnExistingAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    // this’s value.
    return this[$value];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string) {
    // Set an existing attribute value with this and the given value.
    setAnExistingAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  protected override clone(document: Document): Attr {
    return cloneAttr(this, document);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-namespaceuri
   */
  get namespaceURI(): string | null {
    // The namespaceURI getter steps are to return this’s namespace.
    return this[$namespace];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-prefix
   */
  get prefix(): string | null {
    // The prefix getter steps are to return this’s namespace prefix.
    return this[$namespacePrefix];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-localname
   */
  get localName(): string {
    // The localName getter steps are to return this’s local name.
    return this[$localName];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-name
   */
  get name(): string {
    // The name getter steps are to return this’s qualified name.
    return getQualifiedName(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  get value(): string {
    // The value getter steps are to return this’s value.
    return this[$value];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  set value(value: string) {
    // The value getter steps are to return this’s value.
    setAnExistingAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-ownerelement
   */
  get ownerElement(): Element | null {
    // The ownerElement getter steps are to return this’s element.
    return this[$element];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-specified
   */
  get specified(): true {
    // The specified getter steps are to return true.
    return true;
  }
}

/**
 * @see https://dom.spec.whatwg.org/#set-an-existing-attribute-value
 */
export function setAnExistingAttributeValue(
  attribute: Attr,
  value: string,
): void {
  // 1. If attribute’s element is null, then set attribute’s value to value.
  if (attribute[$element] === null) {
    attribute[$value] = value;
  } else {
    // 2. Otherwise, change attribute to value.
    changeAttributes(attribute, value);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-change
 */
export function changeAttributes(attribute: Attr, value: string): void {
  // 1. Let oldValue be attribute’s value.
  const oldValue = attribute[$value];

  // 2. Set attribute’s value to value.
  attribute[$value] = value;

  // 3. Handle attribute changes for attribute with attribute’s element, oldValue, and value.
  if (attribute[$element]) {
    handleAttributesChanges(attribute, attribute[$element], oldValue, value);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#handle-attribute-changes
 */
export function handleAttributesChanges(
  attribute: Attr,
  element: Element,
  oldValue: string | null,
  newValue: string | null,
): void {
  // 1. Queue a mutation record of "attributes" for element with attribute’s local name, attribute’s namespace, oldValue, « », « », null, and null.
  queueMutationRecord(
    "attributes",
    element,
    attribute[$localName],
    attribute[$namespace],
    oldValue,
    new OrderedSet(),
    new OrderedSet(),
    null,
    null,
  );

  // 2. If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, oldValue, newValue, and attribute’s namespace.
  if (isCustom(element)) throw new Error("handleAttributesChanges");

  // 3. Run the attribute change steps with element, attribute’s local name, oldValue, newValue, and attribute’s namespace.
  element[$attributeChangeSteps].run({
    element,
    localName: attribute[$localName],
    oldValue,
    value: newValue,
    namespace: attribute[$namespace],
  });
}

export function cloneAttr(attr: Attr, document: Document): Attr {
  return new Attr({
    namespace: attr[$namespace],
    namespacePrefix: attr[$namespacePrefix],
    localName: attr[$localName],
    value: attr[$value],
    nodeDocument: document,
  });
}