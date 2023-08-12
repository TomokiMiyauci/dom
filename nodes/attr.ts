import { Node, NodeType } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import { type Element } from "./element.ts";
import type { IAttr } from "../interface.d.ts";

export class Attr extends Node implements IAttr {
  _namespace: string | null;
  _namespacePrefix: string | null;
  _localName: string;
  _value = "";
  _element: Element | null;

  constructor(localName: string) {
    super();

    this._namespace = null;
    this._namespacePrefix = null;
    this._element = null;
    this._value = "";
    this._localName = localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-qualified-name
   */
  get #qualifiedName(): string {
    // An attribute’s qualified name is its local name if its namespace prefix is null, and its namespace prefix, followed by ":", followed by its local name, otherwise.
    const prefix = this._namespacePrefix;
    const qualifiedName = prefix === null
      ? this.localName
      : `${prefix}:${this._localName}`;

    return qualifiedName;
  }

  // override nodeDocument: Document = new Document();

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.ATTRIBUTE_NODE {
    return NodeType.ATTRIBUTE_NODE;
  }

  override get nodeName(): string {
    return this.#qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    // this’s value.
    return this._value;
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
    return this._value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string) {
    // Set an existing attribute value with this and the given value.
    setAnExistingAttributeValue(this, value);
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-namespaceuri
   */
  get namespaceURI(): string | null {
    // The namespaceURI getter steps are to return this’s namespace.
    return this._namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-prefix
   */
  get prefix(): string | null {
    // The prefix getter steps are to return this’s namespace prefix.
    return this._namespacePrefix;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-localname
   */
  get localName(): string {
    // The localName getter steps are to return this’s local name.
    return this._localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-name
   */
  get name(): string {
    // The name getter steps are to return this’s qualified name.
    return this.#qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  get value(): string {
    // The value getter steps are to return this’s value.
    return this._value;
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
    return this._element;
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
  if (attribute._element === null) {
    attribute._value = value;
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
  const oldValue = attribute._value;

  // 2. Set attribute’s value to value.
  attribute._value = value;

  // 3. Handle attribute changes for attribute with attribute’s element, oldValue, and value.
  handleAttributesChanges(attribute, attribute._element, oldValue, value);
}

/**
 * @see https://dom.spec.whatwg.org/#handle-attribute-changes
 */
export function handleAttributesChanges(
  attribute: Attr,
  element: Element | null,
  oldValue: string,
  newValue: string,
): void {
  // 1. Queue a mutation record of "attributes" for element with attribute’s local name, attribute’s namespace, oldValue, « », « », null, and null.

  // 2. If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, oldValue, newValue, and attribute’s namespace.

  // 3. Run the attribute change steps with element, attribute’s local name, oldValue, newValue, and attribute’s namespace.
}
