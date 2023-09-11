import { type Document } from "../documents/document.ts";
import { Node, NodeStates, NodeType } from "../node.ts";
import { type PartialBy } from "../../../deps.ts";
import { type Element, isCustom } from "../elements/element.ts";
import type { IAttr } from "../../../interface.d.ts";
import { getQualifiedName } from "../utils.ts";
import { $nodeDocument } from "../internal.ts";
import { queueMutationRecord } from "../mutation_observers/queue.ts";
import { OrderedSet } from "../../../infra/data_structures/set.ts";
import { $, internalSlots } from "../../../internal.ts";

type Optional = "namespace" | "namespacePrefix" | "value" | "element";

export class Attr extends Node implements IAttr {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-attribute-qualified-name)
   */
  private get _qualifiedName(): string {
    return getQualifiedName(this.#_.localName, this.#_.namespacePrefix);
  }

  constructor(
    {
      namespace = null,
      namespacePrefix = null,
      localName,
      element = null,
      value = "",
      nodeDocument,
    }: PartialBy<AttrInternals, Optional> & NodeStates,
  ) {
    super();

    const _: AttrInternals = {
      namespace,
      namespacePrefix,
      value,
      localName,
      element,
    };

    this.#_ = _;
    internalSlots.set(this, _);

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
    return this._qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    // this’s value.
    return this.#_.value;
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
    return this.#_.value;
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
    return this.#_.namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-prefix
   */
  get prefix(): string | null {
    // The prefix getter steps are to return this’s namespace prefix.
    return this.#_.namespacePrefix;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-localname
   */
  get localName(): string {
    // The localName getter steps are to return this’s local name.
    return this.#_.localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-name
   */
  get name(): string {
    // The name getter steps are to return this’s qualified name.
    return this._qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  get value(): string {
    // The value getter steps are to return this’s value.
    return this.#_.value;
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
    return this.#_.element;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-specified
   */
  get specified(): true {
    // The specified getter steps are to return true.
    return true;
  }

  #_: AttrInternals;
}

export interface AttrInternals {
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

/**
 * @see https://dom.spec.whatwg.org/#set-an-existing-attribute-value
 */
export function setAnExistingAttributeValue(
  attribute: Attr,
  value: string,
): void {
  const _ = $(attribute);

  // 1. If attribute’s element is null, then set attribute’s value to value.
  if (_.element === null) _.value = value;
  // 2. Otherwise, change attribute to value.
  else changeAttributes(attribute, value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-change
 */
export function changeAttributes(attribute: Attr, value: string): void {
  const _ = $(attribute);

  // 1. Let oldValue be attribute’s value.
  const oldValue = _.value;

  // 2. Set attribute’s value to value.
  _.value = value;

  // 3. Handle attribute changes for attribute with attribute’s element, oldValue, and value.
  if (_.element) {
    handleAttributesChanges(attribute, _.element, oldValue, value);
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
  const { namespace, localName } = $(attribute);

  // 1. Queue a mutation record of "attributes" for element with attribute’s local name, attribute’s namespace, oldValue, « », « », null, and null.
  queueMutationRecord(
    "attributes",
    element,
    localName,
    namespace,
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
    localName,
    oldValue,
    value: newValue,
    namespace,
  });
}

export function cloneAttr(attr: Attr, document: Document): Attr {
  return new Attr({ ...$(attr), nodeDocument: document });
}
