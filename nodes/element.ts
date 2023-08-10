import { Node, NodeType } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import type { Attr } from "./attr.ts";
import { ParentNode } from "./parent_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { Slottable } from "./slottable.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import type { Document } from "./document.ts";
import type { IElement } from "../interface.d.ts";

export class Element extends Node implements IElement {
  constructor(public readonly tagName: string) {
    super();
    this.attributes = new NamedNodeMap(this);
  }

  override get nodeType(): NodeType.ELEMENT_NODE {
    return NodeType.ELEMENT_NODE;
  }

  override get nodeName(): string {
    throw new UnImplemented();
  }

  override get nodeValue(): string | null {
    throw new UnImplemented();
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

  get attributes(): NamedNodeMap {
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
    throw new UnImplemented();
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
