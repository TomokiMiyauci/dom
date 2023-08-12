import { Node, NodeType } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { Attr } from "./attr.ts";
import { ParentNode } from "./parent_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { Slottable } from "./slottable.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import { Document } from "./document.ts";
import {
  CustomElementDefinition,
  lookUpCustomElementDefinition,
} from "../html/custom_element.ts";
import { Namespace } from "../infra/namespace.ts";
import { List } from "../infra/list.ts";
import type { IElement } from "../interface.d.ts";

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

export class Element extends Node implements IElement {
  #namespace: Namespace | null;
  #namespacePrefix: string | null;
  #localName: string;
  #customElementState: CustomElementState;
  #customElementDefinition: CustomElementDefinition | null;
  #attributeList: List<unknown>;
  #isValue: string | null;

  /**
   * @see https://dom.spec.whatwg.org/#concept-element-qualified-name
   */
  get #qualifiedName(): string {
    // An element’s qualified name is its local name if its namespace prefix is null; otherwise its namespace prefix, followed by ":", followed by its local name.
    const prefix = this.#namespacePrefix;
    const qualifiedName = prefix === null
      ? this.#localName
      : `${prefix}:${this.#localName}`;

    return qualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
   */
  get #upperQualifiedName(): string {
    // 1. Let qualifiedName be this’s qualified name.
    let qualifiedName = this.#qualifiedName;

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII uppercase.
    if (
      this.#namespace === Namespace.HTML && this.nodeDocument._type === "html"
    ) {
      qualifiedName = qualifiedName.toUpperCase();
    }

    // 3. Return qualifiedName.
    return qualifiedName;
  }

  readonly attributes: NamedNodeMap;
  constructor(
    attributeList: List<unknown>,
    namespace: Namespace | null,
    namespacePrefix: string | null,
    localName: string,
    customElementState: CustomElementState,
    customElementDefinition: CustomElementDefinition | null,
    isValue: string | null,
    document: Document,
  ) {
    super();
    this.#attributeList = attributeList;
    this.#namespace = namespace;
    this.#namespacePrefix = namespacePrefix;
    this.#localName = localName;
    this.#customElementState = customElementState;
    this.#customElementDefinition = customElementDefinition;
    this.#isValue = isValue;
    this.nodeDocument = document;

    this.attributes = new NamedNodeMap(this);
  }

  override nodeDocument: Document;

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

  override get textContent(): string | null {
    throw new UnImplemented();
  }
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
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

  get localName(): string {
    throw new UnImplemented();
  }

  get namespaceURI(): string | null {
    throw new UnImplemented();
  }

  onfullscreenchange: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
  onfullscreenerror: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
  outerHTML: string = "";

  get ownerDocument(): Document {
    return this.nodeDocument;
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
  closest<E extends globalThis.Element = globalThis.Element>(
    selectors: string,
  ): E | null;
  closest(
    selectors: unknown,
  ):
    | E
    | HTMLElementTagNameMap[K]
    | SVGElementTagNameMap[K]
    | MathMLElementTagNameMap[K]
    | null {
    throw new UnImplemented();
  }

  computedStyleMap(): StylePropertyMapReadOnly {
    throw new UnImplemented();
  }

  getAttribute(qualifiedName: string): string | null {
    throw new UnImplemented();
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
  ): HTMLCollectionOf<globalThis.Element>;
  getElementsByTagName(
    qualifiedName: unknown,
  ):
    | HTMLCollectionOf<HTMLElementTagNameMap[K]>
    | HTMLCollectionOf<SVGElementTagNameMap[K]>
    | HTMLCollectionOf<MathMLElementTagNameMap[K]>
    | HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>
    | HTMLCollectionOf<globalThis.Element> {
    throw new UnImplemented();
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
    namespace: unknown,
    localName: unknown,
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

  setAttribute(qualifiedName: string, value: string): void {
    throw new UnImplemented();
  }

  setAttributeNS(
    namespace: string | null,
    qualifiedName: string,
    value: string,
  ): void {
    throw new UnImplemented();
  }

  setAttributeNode(attr: Attr): Attr | null {
    throw new UnImplemented();
  }

  setAttributeNodeNS(attr: Attr): Attr | null {
    throw new UnImplemented();
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

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new UnImplemented();
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  removeEventListener(
    type: unknown,
    callback: unknown,
    options?: unknown,
  ): void {
    throw new UnImplemented();
  }
}

export interface Element
  extends NonDocumentTypeChildNode, ParentNode, Slottable {}

export function setAttribute(attr: Attr, element: Element): Attr | null {}

/**
 * [DOM Living Standard](https://dom.spec.whatwg.org/#concept-create-element)
 */
export function createElement(
  document: Document,
  localName: string,
  namespace: Namespace | null,
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
  if (definition !== null && definition.name !== definition.localName) {}
  // 1. Let interface be the element interface for localName and the HTML namespace.

  // 2. Set result to a new element that implements interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to is, and node document set to document.

  // 3. If the synchronous custom elements flag is set, then run this step while catching any exceptions:

  // 1. Upgrade element using definition.

  // If this step threw an exception, then:

  // 1. Report the exception.

  // 2. Set result’s custom element state to "failed".

  // 4. Otherwise, enqueue a custom element upgrade reaction given result and definition.

  // 6. Otherwise, if definition is non-null, then:
  else if (definition !== null) {}
  // 1. If the synchronous custom elements flag is set, then run these steps while catching any exceptions:

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
