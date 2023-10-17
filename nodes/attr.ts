import { Node, NodeType } from "./node.ts";
import type { IAttr } from "../interface.d.ts";
import { qualifiedName } from "./utils/attr.ts";
import { $ } from "../internal.ts";
import { setExistAttributeValue } from "./utils/attr.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import type { $Attr, $Element, AttrInternals } from "../i.ts";
import {
  element,
  localName,
  namespace,
  namespacePrefix,
  nodeDocument,
  value,
} from "../symbol.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#attr)
 */
@Exposed("Window", "Attr")
export class Attr extends Node implements IAttr, AttrInternals {
  protected constructor() {
    super();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.ATTRIBUTE_NODE {
    return NodeType.ATTRIBUTE_NODE;
  }

  override get nodeName(): string {
    return qualifiedName(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    // this’s value.
    return this[value];
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
    return this[value];
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
    return this[nodeDocument];
  }

  protected override clone(document: Document): $Attr {
    return cloneAttr(this, document);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-namespaceuri
   */
  get namespaceURI(): string | null {
    // The namespaceURI getter steps are to return this’s namespace.
    return this[namespace];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-prefix
   */
  get prefix(): string | null {
    // The prefix getter steps are to return this’s namespace prefix.
    return this[namespacePrefix];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-localname
   */
  get localName(): string {
    // The localName getter steps are to return this’s local name.
    return this[localName];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-name
   */
  get name(): string {
    // The name getter steps are to return this’s qualified name.
    return qualifiedName(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-value
   */
  get value(): string {
    // The value getter steps are to return this’s value.
    return this[value];
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
    return this[element];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-attr-specified
   */
  get specified(): true {
    // The specified getter steps are to return true.
    return true;
  }

  get #_() {
    return $<Attr>(this);
  }

  [namespace]: string | null = null;
  [namespacePrefix]: string | null = null;

  /**
   * @remarks Set after creation
   */
  [localName]!: string;
  [value]: string = "";
  [element]: $Element | null = null;
}

export function cloneAttr(attr: $Attr, document: Document): Attr {
  const attribute: Attr = Reflect.construct(Attr, []);
  attribute[localName] = attr[localName],
    attribute[value] = attr[value],
    attribute[namespace] = attr[namespace],
    attribute[namespacePrefix] = attr[namespacePrefix],
    attribute[element] = attr[element],
    attribute[nodeDocument] = document;

  return attribute;
}
