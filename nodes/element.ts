import {
  getElementsByClassName,
  getElementsByQualifiedName,
  Node,
  NodeStates,
  NodeType,
} from "./node.ts";
import { getQualifiedName, UnImplemented } from "./utils.ts";
import {
  Attr,
  changeAttributes,
  cloneAttr,
  equalsAttr,
  handleAttributesChanges,
} from "./attr.ts";
import { ParentNode } from "./parent_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import { type Document, isHTMLDocument } from "./document.ts";
import { CustomElementDefinition } from "../html/custom_element.ts";
import { Namespace, validateAndExtract } from "../infra/namespace.ts";
import { List } from "../infra/list.ts";
import { descendantTextContent } from "./text.ts";
import { every, find, some } from "../deps.ts";
import type { IElement } from "../interface.d.ts";
import { Text } from "./text.ts";
import { replaceAllNode } from "./mutation.ts";
import {
  $attributeChangeSteps,
  $attributeList,
  $create,
  $customElementState,
  $element,
  $isValue,
  $localName,
  $namespace,
  $namespacePrefix,
  $nodeDocument,
  $value,
} from "./internal.ts";
import { ARIAMixin } from "../wai_aria/aria_mixin.ts";
import { Animatable } from "../web_animations/animatable.ts";
import { InnerHTML } from "../domparsing/inner_html.ts";
import { ChildNode } from "./child_node.ts";
import { Slottable } from "./slottable.ts";
import { DOMTokenList } from "./dom_token_list.ts";
import { Element_CSSOMView } from "../cssom_view/element.ts";
import { Element_CSSTypedOM } from "../css/css_typed_om/element.ts";
import { Element_DomParsing } from "../domparsing/element.ts";
import { Element_PointerEvents } from "../pointerevents/element.ts";
import { Element_PointerLock } from "../pointerlock/element.ts";
import { Element_Fullscreen } from "../fullscreen/element.ts";

/**
 * [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-custom-element-state)
 */
enum CustomElementState {
  Undefined = "undefined",
  Failed = "failed",
  Uncustomized = "uncustomized",
  Precustomized = "precustomized",
  Custom = "custom",
}

export interface AttributeInits {
  namespace: string | null;
  namespacePrefix: string | null;
  localName: string;
  customElementState: CustomElementState;
  customElementDefinition: CustomElementDefinition | null;
  isValue: string | null;
  attributeList?: List<Attr>;
}

@ARIAMixin
@Animatable
@ChildNode
@InnerHTML
@NonDocumentTypeChildNode
@ParentNode
@Slottable
@Element_CSSOMView
@Element_CSSTypedOM
@Element_DomParsing
@Element_PointerEvents
@Element_PointerLock
@Element_Fullscreen
export class Element extends Node implements IElement {
  [$namespace]: string | null;
  [$namespacePrefix]: string | null;
  [$localName]: string;
  [$customElementState]: CustomElementState;
  #customElementDefinition: CustomElementDefinition | null;
  [$attributeList]: List<Attr>;
  [$isValue]: string | null;
  [$attributeChangeSteps]: AttributeChangeSteps;

  _ID: string | null = null;

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-attributes
   */
  readonly attributes: NamedNodeMap;

  /**
   * @see https://dom.spec.whatwg.org/#concept-element-qualified-name
   */
  get #qualifiedName(): string {
    return getQualifiedName(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
   */
  get #upperQualifiedName(): string {
    // 1. Let qualifiedName be this’s qualified name.
    let qualifiedName = this.#qualifiedName;

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII uppercase.
    if (
      this[$namespace] === Namespace.HTML &&
      this[$nodeDocument]._type === "html"
    ) {
      qualifiedName = qualifiedName.toUpperCase();
    }

    // 3. Return qualifiedName.
    return qualifiedName;
  }

  constructor({
    namespace,
    namespacePrefix,
    localName,
    customElementState,
    customElementDefinition,
    isValue,
    nodeDocument,
    attributeList = new List(),
  }: AttributeInits & NodeStates) {
    super();

    const attributeChangeStep: AttributeChangeCallback = (
      { localName, namespace, value },
    ) => {
      // 1. If localName is id, namespace is null, and value is null or the empty string, then unset element’s ID.
      if (localName === "id" && namespace === null) {
        // 2. Otherwise, if localName is id, namespace is null, then set element’s ID to value.
        this._ID = value ? value : null;
      }
    };

    const steps = new AttributeChangeSteps();
    steps.define(attributeChangeStep);

    this[$attributeChangeSteps] = steps;
    this[$namespace] = namespace;
    this[$namespacePrefix] = namespacePrefix;
    this[$localName] = localName;
    this[$customElementState] = customElementState;
    this.#customElementDefinition = customElementDefinition;
    this[$isValue] = isValue;
    this[$nodeDocument] = nodeDocument;
    this[$attributeList] = attributeList;
    this.attributes = new NamedNodeMap({
      attributeList: this[$attributeList],
      element: this,
    });
  }

  override [$nodeDocument]: Document;

  override get nodeType(): NodeType.ELEMENT_NODE {
    return NodeType.ELEMENT_NODE;
  }

  override get nodeName(): string {
    return this.#upperQualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(_: unknown) {
    // noop
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    return descendantTextContent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    value ??= "";

    // String replace all with the given value within this.
    replaceAllString(value, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  protected override equals(other: this): boolean {
    // Its namespace, namespace prefix, local name, and its attribute list’s size.
    return this[$namespace] === other[$namespace] &&
      this[$namespacePrefix] === other[$namespacePrefix] &&
      this[$localName] === other[$localName] &&
      this[$attributeList].size === other[$attributeList].size &&
      // each attribute in its attribute list has an attribute that equals an attribute in B’s attribute list.
      // TODO:(miyauci) improve performance. O(n²)
      every(
        this[$attributeList],
        (left) =>
          some(other[$attributeList], (right) => equalsAttr(left, right)),
      );
  }

  protected override clone(document: Document): Element {
    const copy = createElement(
      document,
      this[$localName],
      this[$namespace],
      this[$namespacePrefix],
      this[$isValue],
    );

    for (const attribute of this[$attributeList]) {
      appendAttribute(cloneAttr(attribute, document), copy);
    }

    return copy;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-classlist
   */
  get classList(): DOMTokenList {
    // return a DOMTokenList object whose associated element is this and whose associated attribute’s local name is class.
    return new DOMTokenList({ element: this, localName: "class" });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-classname
   */
  get className(): string {
    // TODO(miyauci): use auto-accessor and accessor decorator
    return getAttributeValue(this, "class");
  }

  set className(value: string) {
    setAttributeValue(this, "class", value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-id
   */
  get id(): string {
    // reflect "id".
    return getAttributeValue(this, "id");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-id
   */
  set id(value: string) {
    setAttributeValue(this, "id", value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-localname
   */
  get localName(): string {
    return this[$localName];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-namespaceuri
   */
  get namespaceURI(): string | null {
    // return this’s namespace.
    return this[$namespace];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-tagname
   */
  get tagName(): string {
    return this.#upperQualifiedName;
  }

  get part(): DOMTokenList {
    throw new UnImplemented("part");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-prefix
   */
  get prefix(): string | null {
    // return this’s namespace prefix.
    return this[$namespacePrefix];
  }

  get shadowRoot(): ShadowRoot | null {
    throw new UnImplemented("shadowRoot");
  }

  get slot(): string {
    throw new UnImplemented("slot getter");
  }

  set slot(value: string) {
    throw new UnImplemented("slot setter");
  }

  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new UnImplemented("attachShadow");
  }

  closest<K extends keyof HTMLElementTagNameMap>(
    selector: K,
  ): HTMLElementTagNameMap[K] | null;
  closest<K extends keyof SVGElementTagNameMap>(
    selector: K,
  ): SVGElementTagNameMap[K] | null;
  closest<K extends keyof MathMLElementTagNameMap>(
    selector: K,
  ): MathMLElementTagNameMap[K] | null;
  closest<E extends Element = Element>(
    selectors: string,
  ): E | null;
  closest<E extends Element = Element>(
    selectors: string,
  ): E | null {
    throw new UnImplemented("closest");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattribute
   */
  getAttribute(qualifiedName: string): string | null {
    // 1. Let attr be the result of getting an attribute given qualifiedName and this.
    const attr = getAttributeByName(qualifiedName, this);

    // 2. If attr is null, return null.
    if (attr === null) return attr;

    // 3. Return attr’s value.
    return attr[$value];
  }

  getAttributeNS(namespace: string | null, localName: string): string | null {
    throw new UnImplemented("getAttributeNS");
  }

  getAttributeNames(): string[] {
    throw new UnImplemented("getAttributeNames");
  }

  getAttributeNode(qualifiedName: string): Attr | null {
    throw new UnImplemented("getAttributeNode");
  }

  getAttributeNodeNS(namespace: string | null, localName: string): Attr | null {
    throw new UnImplemented("getAttributeNodeNS");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getelementsbyclassname
   */
  getElementsByClassName(
    classNames: string,
  ): HTMLCollectionOf<Element> {
    // return the list of elements with class names classNames for this.
    return getElementsByClassName(classNames, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getelementsbytagname
   */
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(
    qualifiedName: string,
  ): HTMLCollectionOf<Element>;
  getElementsByTagName(
    qualifiedName: string,
  ): HTMLCollectionOf<Element> {
    return getElementsByQualifiedName(qualifiedName, this);
  }

  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/1999/xhtml",
    localName: string,
  ): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/2000/svg",
    localName: string,
  ): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/1998/Math/MathML",
    localName: string,
  ): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(
    namespace: string | null,
    localName: string,
  ): HTMLCollectionOf<globalThis.Element>;
  getElementsByTagNameNS(
    namespace: string | null,
    localName: string,
  ):
    | HTMLCollectionOf<HTMLElement>
    | HTMLCollectionOf<SVGElement>
    | HTMLCollectionOf<MathMLElement>
    | HTMLCollectionOf<globalThis.Element> {
    throw new UnImplemented("getElementsByTagNameNS");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-hasattribute
   */
  hasAttribute(qualifiedName: string): boolean {
    // 1. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
    if (
      this[$namespace] === Namespace.HTML && isHTMLDocument(this[$nodeDocument])
    ) {
      qualifiedName = qualifiedName.toLowerCase();
    }

    // 2. Return true if this has an attribute whose qualified name is qualifiedName; otherwise false.
    return hasAttributeByQualifiedName(qualifiedName, this);
  }

  hasAttributeNS(namespace: string | null, localName: string): boolean {
    throw new UnImplemented("hasAttributeNS");
  }

  hasAttributes(): boolean {
    throw new UnImplemented("hasAttributes");
  }

  insertAdjacentElement(
    where: InsertPosition,
    element: globalThis.Element,
  ): globalThis.Element | null {
    throw new UnImplemented("insertAdjacentElement");
  }

  insertAdjacentText(where: InsertPosition, data: string): void {
    throw new UnImplemented("insertAdjacentText");
  }

  matches(selectors: string): boolean {
    throw new UnImplemented("matches");
  }

  removeAttribute(qualifiedName: string): void {
    throw new UnImplemented("removeAttribute");
  }

  removeAttributeNS(namespace: string | null, localName: string): void {
    throw new UnImplemented("removeAttributeNS");
  }

  removeAttributeNode(attr: Attr): Attr {
    throw new UnImplemented("removeAttributeNode");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattribute
   */
  setAttribute(qualifiedName: string, value: string): void {
    // 1. If qualifiedName does not match the Name production in XML, then throw an "InvalidCharacterError" DOMException.

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
    if (
      this[$namespace] === Namespace.HTML && this[$nodeDocument]._type !== "xml"
    ) qualifiedName = qualifiedName.toLowerCase();

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is qualifiedName, and null otherwise.
    const attribute = find(
      this[$attributeList],
      (attr) => getQualifiedName(attr) === qualifiedName,
    ) ?? null;

    // 4. If attribute is null, create an attribute whose local name is qualifiedName, value is value, and node document is this’s node document, then append this attribute to this, and then return.
    if (attribute === null) {
      const attribute = new Attr({
        localName: qualifiedName,
        value,
        nodeDocument: this[$nodeDocument],
      });

      appendAttribute(attribute, this);
      return;
    }

    // 5. Change attribute to value.
    changeAttributes(attribute, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributens
   */
  setAttributeNS(
    namespace: string | null,
    qualifiedName: string,
    value: string,
  ): void {
    // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName to validate and extract.
    const { namespace: ns, prefix, localName } = validateAndExtract(
      namespace,
      qualifiedName,
    );

    // 2. Set an attribute value for this using localName, value, and also prefix and namespace.
    setAttributeValue(this, localName, value, prefix, ns);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributenode
   */
  setAttributeNode(attr: Attr): Attr | null {
    // to return the result of setting an attribute given attr and this.
    return setAttribute(attr, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributenodens
   */
  setAttributeNodeNS(attr: Attr): Attr | null {
    // to return the result of setting an attribute given attr and this.
    return setAttribute(attr, this);
  }

  toggleAttribute(qualifiedName: string, force?: boolean | undefined): boolean {
    throw new UnImplemented("toggleAttribute");
  }

  webkitMatchesSelector(selectors: string): boolean {
    throw new UnImplemented("webkitMatchesSelector");
  }
}

export interface Element
  extends
    ARIAMixin,
    Animatable,
    ChildNode,
    InnerHTML,
    NonDocumentTypeChildNode,
    ParentNode,
    Slottable,
    Element_CSSOMView,
    Element_CSSTypedOM,
    Element_DomParsing,
    Element_PointerEvents,
    Element_PointerLock,
    Element_Fullscreen {}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-value
 */
export function getAttributeValue(
  element: Element,
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
  return attr[$value];
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
 */
export function setAttribute(attr: Attr, element: Element): Attr | null {
  // 1. If attr’s element is neither null nor element, throw an "InUseAttributeError" DOMException.
  if (!(attr[$element] === null || attr[$element] === element)) {
    throw new DOMException(
      "The attribute is in use by another element",
      "InUseAttributeError",
    );
  }

  // 2. Let oldAttr be the result of getting an attribute given attr’s namespace, attr’s local name, and element.
  const oldAttr = getAttributeByNamespaceAndLocalName(
    attr[$namespace],
    attr[$localName],
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
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set-value
 */
export function setAttributeValue(
  element: Element,
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
    const attr = new Attr({
      namespace,
      namespacePrefix: prefix,
      localName,
      value,
      nodeDocument: element[$nodeDocument],
    });

    appendAttribute(attr, element);
    return;
  }
  // 3. Change attribute to value.
  changeAttributes(attribute, value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
 */
export function getAttributeByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  element: Element,
): Attr | null {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. Return the attribute in element’s attribute list whose namespace is namespace and local name is localName, if any; otherwise null.
  return find(
    element[$attributeList],
    (attribute) =>
      attribute[$namespace] === namespace &&
      attribute[$localName] === localName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-append
 */
export function appendAttribute(attribute: Attr, element: Element): void {
  // 1. Append attribute to element’s attribute list.
  element[$attributeList].append(attribute);

  // 2. Set attribute’s element to element.
  attribute[$element] = element;

  // 3. Handle attribute changes for attribute with element, null, and attribute’s value.
  handleAttributesChanges(attribute, element, null, attribute[$value]);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-replace
 */
export function replaceAttribute(oldAttr: Attr, newAttr: Attr): void {
  throw new Error("replaceAttribute");
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
 */
export function getAttributeByName(
  qualifiedName: string,
  element: Element,
): Attr | null {
  // 1. If element is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
  if (
    element[$namespace] === Namespace.HTML &&
    element[$nodeDocument]._type !== "xml"
  ) qualifiedName = qualifiedName.toLowerCase();

  // 2. Return the first attribute in element’s attribute list whose qualified name is qualifiedName; otherwise null.
  return find(
    element[$attributeList],
    (attribute) => getQualifiedName(attribute) === qualifiedName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#string-replace-all
 */
export function replaceAllString(string: string, parent: Node): void {
  // 1. Let node be null.
  let node = null;

  // 2. If string is not the empty string, then set node to a new Text node whose data is string and node document is parent’s node document.
  if (string !== "") {
    node = Text[$create]({ data: string, nodeDocument: parent[$nodeDocument] });
  }

  // 3. Replace all with node within parent.
  replaceAllNode(node, parent);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-custom
 */
export function isCustom(element: Element): boolean {
  // An element whose custom element state is "custom
  return element[$customElementState] === CustomElementState.Custom;
}

export function hasAttributeByQualifiedName(
  qualifiedName: string,
  element: Element,
): boolean {
  for (const attr of element[$attributeList]) {
    if (getQualifiedName(attr) === qualifiedName) return true;
  }

  return false;
}

export interface AttributesContext {
  element: Element;
  localName: string;
  oldValue: string | null;
  value: string | null;
  namespace: string | null;
}

export interface AttributeChangeCallback {
  (ctx: AttributesContext): void;
}

export class AttributeChangeSteps {
  #callbacks = new Set<AttributeChangeCallback>();
  define(callback: AttributeChangeCallback) {
    this.#callbacks.add(callback);
  }

  run(ctx: AttributesContext): void {
    this.#callbacks.forEach((callback) => callback(ctx));
  }
}
