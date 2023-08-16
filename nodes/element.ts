import { getElementsByQualifiedName, Node, NodeType } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import {
  Attr,
  changeAttributes,
  equalsAttr,
  handleAttributesChanges,
} from "./attr.ts";
import { ParentNode } from "./parent_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import { Document } from "./document.ts";
import {
  CustomElementDefinition,
  lookUpCustomElementDefinition,
} from "../html/custom_element.ts";
import { Namespace, validateAndExtract } from "../infra/namespace.ts";
import { List } from "../infra/list.ts";
import { descendantTextContent } from "./text.ts";
import { every, find, some } from "../deps.ts";
import type { IElement } from "../interface.d.ts";
import { Text } from "./text.ts";
import { replaceAllNode } from "./mutation.ts";
import {
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

@ARIAMixin
@Animatable
@ChildNode
@InnerHTML
@NonDocumentTypeChildNode
@ParentNode
@Slottable
export class Element extends Node implements IElement {
  [$namespace]: string | null;
  [$namespacePrefix]: string | null;
  [$localName]: string;
  [$customElementState]: CustomElementState;
  #customElementDefinition: CustomElementDefinition | null;
  _attributeList: List<Attr>;
  [$isValue]: string | null;

  _ID: string | null = null;

  /**
   * @see https://dom.spec.whatwg.org/#concept-element-qualified-name
   */
  get _qualifiedName(): string {
    // An element’s qualified name is its local name if its namespace prefix is null; otherwise its namespace prefix, followed by ":", followed by its local name.
    const prefix = this[$namespacePrefix];
    const qualifiedName = prefix === null
      ? this[$localName]
      : `${prefix}:${this[$localName]}`;

    return qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
   */
  get #upperQualifiedName(): string {
    // 1. Let qualifiedName be this’s qualified name.
    let qualifiedName = this._qualifiedName;

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

  readonly attributes: NamedNodeMap;
  constructor(
    attributeList: List<Attr>,
    namespace: string | null,
    namespacePrefix: string | null,
    localName: string,
    customElementState: CustomElementState,
    customElementDefinition: CustomElementDefinition | null,
    isValue: string | null,
    document: Document,
  ) {
    super();
    this._attributeList = attributeList;
    this[$namespace] = namespace;
    this[$namespacePrefix] = namespacePrefix;
    this[$localName] = localName;
    this[$customElementState] = customElementState;
    this.#customElementDefinition = customElementDefinition;
    this[$isValue] = isValue;
    this[$nodeDocument] = document;

    this.attributes = new NamedNodeMap(this);
  }

  override [$nodeDocument]: Document;

  override get nodeType(): NodeType.ELEMENT_NODE {
    return NodeType.ELEMENT_NODE;
  }

  override get nodeName(): string {
    return this.#upperQualifiedName;
  }

  override get nodeValue(): null {
    return null;
  }

  override set nodeValue(value: string | null) {
    throw new UnImplemented();
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
      this._attributeList.size === other._attributeList.size &&
      // each attribute in its attribute list has an attribute that equals an attribute in B’s attribute list.
      // TODO:(miyauci) improve performance. O(n²)
      every(
        this._attributeList,
        (left) =>
          some(other._attributeList, (right) => equalsAttr(left, right)),
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

    for (const attribute of this._attributeList) {
      appendAttribute(attribute.clone(document), copy);
    }

    return copy;
  }

  get classList(): DOMTokenList {
    throw new UnImplemented();
  }

  className: string = "";

  get clientHeight(): number {
    throw new UnImplemented();
  }

  get clientLeft(): number {
    throw new UnImplemented();
  }

  get clientTop(): number {
    throw new UnImplemented();
  }

  get clientWidth(): number {
    throw new UnImplemented();
  }

  id: string = "";

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-localname
   */
  get localName(): string {
    return this[$localName];
  }

  get namespaceURI(): string | null {
    throw new UnImplemented();
  }

  onfullscreenchange: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
  onfullscreenerror: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
  outerHTML: string = "";

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-tagname
   */
  get tagName(): string {
    return this.#upperQualifiedName;
  }

  get part(): DOMTokenList {
    throw new UnImplemented();
  }

  get prefix(): string | null {
    throw new UnImplemented();
  }

  get scrollHeight(): number {
    throw new UnImplemented();
  }

  scrollLeft: number = 0;

  scrollTop: number = 0;

  get scrollWidth(): number {
    throw new UnImplemented();
  }

  get shadowRoot(): ShadowRoot | null {
    throw new UnImplemented();
  }

  slot: string = "";

  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new UnImplemented();
  }

  checkVisibility(options?: CheckVisibilityOptions | undefined): boolean {
    throw new UnImplemented();
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
    throw new UnImplemented();
  }

  computedStyleMap(): StylePropertyMapReadOnly {
    throw new UnImplemented();
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
    throw new UnImplemented();
  }

  getAttributeNames(): string[] {
    throw new UnImplemented();
  }

  getAttributeNode(qualifiedName: string): Attr | null {
    throw new UnImplemented();
  }

  getAttributeNodeNS(namespace: string | null, localName: string): Attr | null {
    throw new UnImplemented();
  }

  getBoundingClientRect(): DOMRect {
    throw new UnImplemented();
  }

  getClientRects(): DOMRectList {
    throw new UnImplemented();
  }

  getElementsByClassName(
    classNames: string,
  ): HTMLCollectionOf<globalThis.Element> {
    throw new UnImplemented();
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
    throw new UnImplemented();
  }

  hasAttribute(qualifiedName: string): boolean {
    throw new UnImplemented();
  }

  hasAttributeNS(namespace: string | null, localName: string): boolean {
    throw new UnImplemented();
  }

  hasAttributes(): boolean {
    throw new UnImplemented();
  }

  hasPointerCapture(pointerId: number): boolean {
    throw new UnImplemented();
  }

  insertAdjacentElement(
    where: InsertPosition,
    element: globalThis.Element,
  ): globalThis.Element | null {
    throw new UnImplemented();
  }

  insertAdjacentHTML(position: InsertPosition, text: string): void {
    throw new UnImplemented();
  }

  insertAdjacentText(where: InsertPosition, data: string): void {
    throw new UnImplemented();
  }

  matches(selectors: string): boolean {
    throw new UnImplemented();
  }

  releasePointerCapture(pointerId: number): void {
    throw new UnImplemented();
  }

  removeAttribute(qualifiedName: string): void {
    throw new UnImplemented();
  }

  removeAttributeNS(namespace: string | null, localName: string): void {
    throw new UnImplemented();
  }

  removeAttributeNode(attr: Attr): Attr {
    throw new UnImplemented();
  }

  requestFullscreen(options?: FullscreenOptions | undefined): Promise<void> {
    throw new UnImplemented();
  }

  requestPointerLock(): void {
    throw new UnImplemented();
  }

  scroll(options?: ScrollToOptions | undefined): void;
  scroll(x: number, y: number): void;
  scroll(x?: unknown, y?: unknown): void {
    throw new UnImplemented();
  }

  scrollBy(options?: ScrollToOptions | undefined): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: unknown, y?: unknown): void {
    throw new UnImplemented();
  }

  scrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void {
    throw new UnImplemented();
  }

  scrollTo(options?: ScrollToOptions | undefined): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: unknown, y?: unknown): void {
    throw new UnImplemented();
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
      this._attributeList,
      (attr) => attr._qualifiedName === qualifiedName,
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

  setPointerCapture(pointerId: number): void {
    throw new UnImplemented();
  }

  toggleAttribute(qualifiedName: string, force?: boolean | undefined): boolean {
    throw new UnImplemented();
  }

  webkitMatchesSelector(selectors: string): boolean {
    throw new UnImplemented();
  }

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  override addEventListener(
    type: unknown,
    listener: unknown,
    options?: unknown,
  ): void {
    throw new UnImplemented();
  }

  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  override removeEventListener(
    type: unknown,
    callback: unknown,
    options?: unknown,
  ): void {
    throw new UnImplemented();
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
    Slottable {}

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
 * [DOM Living Standard](https://dom.spec.whatwg.org/#concept-create-element)
 */
export function createElement(
  document: Document,
  localName: string,
  namespace: string | null,
  prefix: string | null = null, // 1. If prefix was not given, let prefix be null.
  is: string | null = null, // 2. If is was not given, let is be null.
  synchronousCustomElements: boolean | null = null,
): Element {
  // 3. Let result be null.
  let result: Element | null = null;

  // 4. Let definition be the result of looking up a custom element definition given document, namespace, localName, and is.
  const definition = lookUpCustomElementDefinition(
    document,
    namespace,
    localName,
    is,
  );

  // 5. If definition is non-null, and definition’s name is not equal to its local name (i.e., definition represents a customized built-in element), then:
  if (definition !== null && definition.name !== definition.localName) {
    throw new Error();
  } // 1. Let interface be the element interface for localName and the HTML namespace.

  // 2. Set result to a new element that implements interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to is, and node document set to document.

  // 3. If the synchronous custom elements flag is set, then run this step while catching any exceptions:

  // 1. Upgrade element using definition.

  // If this step threw an exception, then:

  // 1. Report the exception.

  // 2. Set result’s custom element state to "failed".

  // 4. Otherwise, enqueue a custom element upgrade reaction given result and definition.

  // 6. Otherwise, if definition is non-null, then:
  else if (definition !== null) {
    throw new Error();
  } // 1. If the synchronous custom elements flag is set, then run these steps while catching any exceptions:

  // 1. Let C be definition’s constructor.

  // 2. Set result to the result of constructing C, with no arguments.

  // 3. Assert: result’s custom element state and custom element definition are initialized.

  // 4. Assert: result’s namespace is the HTML namespace.

  // 5. If result’s attribute list is not empty, then throw a "NotSupportedError" DOMException.

  // 6. If result has children, then throw a "NotSupportedError" DOMException.

  // 7. If result’s parent is not null, then throw a "NotSupportedError" DOMException.

  // 8. If result’s node document is not document, then throw a "NotSupportedError" DOMException.

  // 9. If result’s local name is not equal to localName, then throw a "NotSupportedError" DOMException.

  // 10. Set result’s namespace prefix to prefix.

  // 11. Set result’s is value to null.

  // If any of these steps threw an exception, then:

  // 1. Report the exception.

  // 2. Set result to a new element that implements the HTMLUnknownElement interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "failed", custom element definition set to null, is value set to null, and node document set to document.

  // 2. Otherwise:

  // 1. Set result to a new element that implements the HTMLElement interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to null, and node document set to document.

  // 2. Enqueue a custom element upgrade reaction given result and definition.

  // 7. Otherwise:
  else {
    // 1. Let interface be the element interface for localName and namespace.
    const Interface = Element;

    // 2. Set result to a new element that implements interface, with no attributes, namespace set to namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "uncustomized", custom element definition set to null, is value set to is, and node document set to document.
    result = new Interface(
      new List(),
      namespace,
      prefix,
      localName,
      CustomElementState.Uncustomized,
      null,
      is,
      document,
    );

    // 3. If namespace is the HTML namespace, and either localName is a valid custom element name or is is non-null, then set result’s custom element state to "undefined".
  }

  // 8. Return result.
  return result!;
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
    element._attributeList,
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
  element._attributeList.append(attribute);

  // 2. Set attribute’s element to element.
  attribute[$element] = element;

  // 3. Handle attribute changes for attribute with element, null, and attribute’s value.
  handleAttributesChanges(attribute, element, null, attribute[$value]);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-replace
 */
export function replaceAttribute(oldAttr: Attr, newAttr: Attr): void {
  throw new Error();
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
    element._attributeList,
    (attribute) => attribute._qualifiedName === qualifiedName,
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
