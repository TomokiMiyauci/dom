import { Node, NodeType } from "../node.ts";
import { type PartialBy } from "../../../deps.ts";
import type { IAttr } from "../../../interface.d.ts";
import { getQualifiedName } from "../utils.ts";
import { $, internalSlots } from "../../../internal.ts";
import { setExistAttributeValue } from "./attr_utils.ts";

type Required = "localName";

type Optional =
  | "namespace"
  | "namespacePrefix"
  | "value"
  | "element";

export class Attr extends Node implements IAttr {
  constructor(
    {
      namespace = null,
      namespacePrefix = null,
      localName,
      element = null,
      value = "",
      nodeDocument,
    }: PartialBy<Pick<AttrInternals, Required | Optional>, Optional> & {
      nodeDocument: Document;
    },
  ) {
    super(nodeDocument);

    const internal = new AttrInternals({
      namespace,
      namespacePrefix,
      value,
      localName,
      element,
    });
    const _ = Object.assign(this._, internal);

    this._ = _;
    internalSlots.set(this, _);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.ATTRIBUTE_NODE {
    return NodeType.ATTRIBUTE_NODE;
  }

  override get nodeName(): string {
    return this._.qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    // this’s value.
    return this._.value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(value: string) {
    // Set an existing attribute value with this and the given value.
    setExistAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    // this’s value.
    return this._.value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string) {
    // Set an existing attribute value with this and the given value.
    setExistAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this._.nodeDocument;
  }

  protected override clone(document: Document): Attr {
    return cloneAttr(this, document);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-namespaceuri
   */
  get namespaceURI(): string | null {
    // The namespaceURI getter steps are to return this’s namespace.
    return this._.namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-prefix
   */
  get prefix(): string | null {
    // The prefix getter steps are to return this’s namespace prefix.
    return this._.namespacePrefix;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-localname
   */
  get localName(): string {
    // The localName getter steps are to return this’s local name.
    return this._.localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-name
   */
  get name(): string {
    // The name getter steps are to return this’s qualified name.
    return this._.qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  get value(): string {
    // The value getter steps are to return this’s value.
    return this._.value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  set value(value: string) {
    // The value getter steps are to return this’s value.
    setExistAttributeValue(this, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-ownerelement
   */
  get ownerElement(): Element | null {
    // The ownerElement getter steps are to return this’s element.
    return this._.element;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-specified
   */
  get specified(): true {
    // The specified getter steps are to return true.
    return true;
  }

  declare protected _: AttrInternals & Node["_"];
}

export class AttrInternals {
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

  constructor(
    { namespace, localName, value, element, namespacePrefix }: Pick<
      AttrInternals,
      | "namespace"
      | "localName"
      | "value"
      | "element"
      | "namespacePrefix"
    >,
  ) {
    this.namespace = namespace;
    this.localName = localName;
    this.value = value;
    this.element = element;
    this.namespacePrefix = namespacePrefix;

    Object.defineProperty(this, "qualifiedName", {
      get: () => getQualifiedName(this.localName, this.namespacePrefix),
    });
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-attribute-qualified-name)
   */
  qualifiedName!: string;
}

export function cloneAttr(attr: globalThis.Attr, document: Document): Attr {
  return new Attr({ ...$(attr), nodeDocument: document });
}
