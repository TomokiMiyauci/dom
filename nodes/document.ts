import { getElementsByQualifiedName, Node, NodeType } from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { DocumentOrShadowRoot } from "./document_or_shadow_root.ts";
import { FontFaceSource } from "./font_face_source.ts";
import { XPathEvaluatorBase } from "./x_path_evaluator_base.ts";
import { isElement, UnImplemented } from "./utils.ts";
import { Attr } from "./attr.ts";
import { Text } from "./text.ts";
import { Comment } from "./comment.ts";
import { createElement } from "./element.ts";
import { Namespace, validateAndExtract } from "../infra/namespace.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { NonElementParentNode } from "./non_element_parent_node.ts";
import { type IDocument, type IParentNode } from "../interface.d.ts";
import { type DocumentType } from "./document_type.ts";

@ParentNode
@NonElementParentNode
export class Document extends Node implements IDocument {
  _type: "xml" | "html" = "xml";
  _contentType: string = "application/xml";

  /**
   * @see https://momdo.github.io/html/dom.html#current-document-readiness
   */
  _currentDocumentReadiness: DocumentReadyState = "complete";

  override get nodeDocument(): Document {
    return this;
  }

  override get nodeType(): NodeType.DOCUMENT_NODE {
    return NodeType.DOCUMENT_NODE;
  }

  override get nodeName(): "#document" {
    return "#document";
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
  override get textContent(): null {
    return null;
  }

  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  get URL(): string {
    throw new UnImplemented();
  }

  alinkColor: string = "";

  get all(): HTMLAllCollection {
    throw new UnImplemented();
  }

  get anchors(): HTMLCollectionOf<HTMLAnchorElement> {
    throw new UnImplemented();
  }

  get applets(): HTMLCollection {
    throw new UnImplemented();
  }

  bgColor: string = "";
  body: HTMLElement;

  get characterSet(): string {
    throw new UnImplemented();
  }

  charset: string = "";

  get compatMode(): string {
    throw new UnImplemented();
  }

  get contentType(): string {
    return this._contentType;
  }

  cookie: string = "";

  get currentScript(): HTMLOrSVGScriptElement | null {
    throw new UnImplemented();
  }

  get defaultView(): (WindowProxy & typeof globalThis) | null {
    throw new UnImplemented();
  }

  designMode: string = "";
  dif = "";

  get doctype(): DocumentType | null {
    throw new UnImplemented();
  }

  get documentElement(): HTMLElement {
    for (const node of this._children) {
      if (isElement(node)) return node as HTMLElement;
    }

    return null;
  }

  get documentURI(): string {
    throw new UnImplemented();
  }

  domain: string = "";
  dir: string = "";

  get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
    throw new UnImplemented();
  }

  fgColor: string = "";

  get forms(): HTMLCollectionOf<HTMLFormElement> {
    throw new UnImplemented();
  }

  get fullscreen(): boolean {
    throw new UnImplemented();
  }

  get fullscreenEnabled(): boolean {
    throw new UnImplemented();
  }

  get head(): HTMLHeadElement {
    throw new UnImplemented();
  }

  get hidden(): boolean {
    throw new UnImplemented();
  }

  get images(): HTMLCollectionOf<HTMLImageElement> {
    throw new UnImplemented();
  }

  get implementation(): DOMImplementation {
    throw new UnImplemented();
  }

  get inputEncoding(): string {
    throw new UnImplemented();
  }

  get lastModified(): string {
    throw new UnImplemented();
  }

  linkColor: string = "";

  get links(): HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement> {
    throw new UnImplemented();
  }

  get location(): Location {
    throw new UnImplemented();
  }
  set location(href: Location) {
    throw new UnImplemented();
  }
  onfullscreenchange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
  onfullscreenerror: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
  onpointerlockchange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
  onpointerlockerror: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
  onreadystatechange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;
  onvisibilitychange: ((this: globalThis.Document, ev: Event) => any) | null =
    null;

  override get ownerDocument(): null {
    return null;
  }

  get pictureInPictureEnabled(): boolean {
    throw new UnImplemented();
  }

  get plugins(): HTMLCollectionOf<HTMLEmbedElement> {
    throw new UnImplemented();
  }

  /**
   * @see https://momdo.github.io/html/dom.html#dom-document-readystate
   */
  get readyState(): DocumentReadyState {
    // to return this's current document readiness.
    return this._currentDocumentReadiness;
  }

  get referrer(): string {
    throw new UnImplemented();
  }

  get rootElement(): SVGSVGElement | null {
    throw new UnImplemented();
  }

  get scripts(): HTMLCollectionOf<HTMLScriptElement> {
    throw new UnImplemented();
  }

  get scrollingElement(): Element | null {
    throw new UnImplemented();
  }

  get timeline(): DocumentTimeline {
    throw new UnImplemented();
  }

  title: string = "";

  get visibilityState(): DocumentVisibilityState {
    throw new UnImplemented();
  }

  vlinkColor: string = "";

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }
  adoptNode<T extends globalThis.Node>(node: T): T {
    throw new UnImplemented();
  }
  captureEvents(): void {
    throw new UnImplemented();
  }
  caretRangeFromPoint(x: number, y: number): any | null {
    throw new UnImplemented();
  }
  clear(): void {
    throw new UnImplemented();
  }
  close(): void {
    throw new UnImplemented();
  }
  createAttribute(localName: string): Attr {
    return new Attr(localName);
  }
  createAttributeNS(namespace: string | null, qualifiedName: string): Attr {
    throw new UnImplemented();
  }
  createCDATASection(data: string): any {
    throw new UnImplemented();
  }
  createComment(data: string): Comment {
    return new Comment(data);
  }
  createDocumentFragment(): DocumentFragment {
    return new DocumentFragment();
  }

  /**
   * [DOM Living Standard](https://dom.spec.whatwg.org/#dom-document-createelement)
   */
  createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions | undefined,
  ): HTMLElementTagNameMap[K];
  createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions | undefined,
  ): HTMLElementDeprecatedTagNameMap[K];
  createElement(
    tagName: string,
    options?: ElementCreationOptions | undefined,
  ): HTMLElement;
  createElement(
    tagName: string,
    options?: unknown,
  ):
    | HTMLElementTagNameMap[K]
    | HTMLElementDeprecatedTagNameMap[K]
    | HTMLElement {
    // 1. If localName does not match the Name production, then throw an "InvalidCharacterError" DOMException.
    // 2. If this is an HTML document, then set localName to localName in ASCII lowercase.

    // 3. Let is be null.
    const is = null;

    // 4. If options is a dictionary and options["is"] exists, then set is to it.

    // 5. Let namespace be the HTML namespace, if this is an HTML document or this’s content type is "application/xhtml+xml"; otherwise null.
    const namespace =
      (this._type !== "xml" || this._contentType === "application/xhtml+xml")
        ? Namespace.HTML
        : null;

    // 6. Return the result of creating an element given this, localName, namespace, null, is, and with the synchronous custom elements flag set.
    return createElement(this, tagName, namespace, null, is);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createelementns
   */
  createElementNS(
    namespaceURI: "http://www.w3.org/1999/xhtml",
    qualifiedName: string,
  ): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: K,
  ): SVGElementTagNameMap[K];
  createElementNS(
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: string,
  ): SVGElement;
  createElementNS<K extends keyof MathMLElementTagNameMap>(
    namespaceURI: "http://www.w3.org/1998/Math/MathML",
    qualifiedName: K,
  ): MathMLElementTagNameMap[K];
  createElementNS(
    namespaceURI: "http://www.w3.org/1998/Math/MathML",
    qualifiedName: string,
  ): MathMLElement;
  createElementNS(
    namespaceURI: string | null,
    qualifiedName: string,
    options?: ElementCreationOptions | undefined,
  ): Element;
  createElementNS(
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions | undefined,
  ): Element;
  createElementNS(
    namespace: Namespace | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions,
  ):
    | HTMLElement
    | Element
    | SVGElementTagNameMap[K]
    | SVGElement
    | MathMLElementTagNameMap[K]
    | MathMLElement {
    // return the result of running the internal createElementNS steps, given this, namespace, qualifiedName, and options.
    return internalCreateElement(this, namespace, qualifiedName, options);
  }

  createEvent(eventInterface: "AnimationEvent"): AnimationEvent;
  createEvent(eventInterface: "AnimationPlaybackEvent"): AnimationPlaybackEvent;
  createEvent(eventInterface: "AudioProcessingEvent"): AudioProcessingEvent;
  createEvent(eventInterface: "BeforeUnloadEvent"): BeforeUnloadEvent;
  createEvent(eventInterface: "BlobEvent"): BlobEvent;
  createEvent(eventInterface: "ClipboardEvent"): ClipboardEvent;
  createEvent(eventInterface: "CloseEvent"): CloseEvent;
  createEvent(eventInterface: "CompositionEvent"): CompositionEvent;
  createEvent(eventInterface: "CustomEvent"): CustomEvent<any>;
  createEvent(eventInterface: "DeviceMotionEvent"): DeviceMotionEvent;
  createEvent(eventInterface: "DeviceOrientationEvent"): DeviceOrientationEvent;
  createEvent(eventInterface: "DragEvent"): DragEvent;
  createEvent(eventInterface: "ErrorEvent"): ErrorEvent;
  createEvent(eventInterface: "Event"): Event;
  createEvent(eventInterface: "Events"): Event;
  createEvent(eventInterface: "FocusEvent"): FocusEvent;
  createEvent(eventInterface: "FontFaceSetLoadEvent"): FontFaceSetLoadEvent;
  createEvent(eventInterface: "FormDataEvent"): FormDataEvent;
  createEvent(eventInterface: "GamepadEvent"): GamepadEvent;
  createEvent(eventInterface: "HashChangeEvent"): HashChangeEvent;
  createEvent(eventInterface: "IDBVersionChangeEvent"): IDBVersionChangeEvent;
  createEvent(eventInterface: "InputEvent"): InputEvent;
  createEvent(eventInterface: "KeyboardEvent"): KeyboardEvent;
  createEvent(eventInterface: "MIDIConnectionEvent"): MIDIConnectionEvent;
  createEvent(eventInterface: "MIDIMessageEvent"): MIDIMessageEvent;
  createEvent(eventInterface: "MediaEncryptedEvent"): MediaEncryptedEvent;
  createEvent(eventInterface: "MediaKeyMessageEvent"): MediaKeyMessageEvent;
  createEvent(eventInterface: "MediaQueryListEvent"): MediaQueryListEvent;
  createEvent(eventInterface: "MediaStreamTrackEvent"): MediaStreamTrackEvent;
  createEvent(eventInterface: "MessageEvent"): MessageEvent<any>;
  createEvent(eventInterface: "MouseEvent"): MouseEvent;
  createEvent(eventInterface: "MouseEvents"): MouseEvent;
  createEvent(eventInterface: "MutationEvent"): MutationEvent;
  createEvent(eventInterface: "MutationEvents"): MutationEvent;
  createEvent(
    eventInterface: "OfflineAudioCompletionEvent",
  ): OfflineAudioCompletionEvent;
  createEvent(eventInterface: "PageTransitionEvent"): PageTransitionEvent;
  createEvent(
    eventInterface: "PaymentMethodChangeEvent",
  ): PaymentMethodChangeEvent;
  createEvent(
    eventInterface: "PaymentRequestUpdateEvent",
  ): PaymentRequestUpdateEvent;
  createEvent(eventInterface: "PictureInPictureEvent"): PictureInPictureEvent;
  createEvent(eventInterface: "PointerEvent"): PointerEvent;
  createEvent(eventInterface: "PopStateEvent"): PopStateEvent;
  createEvent(eventInterface: "ProgressEvent"): ProgressEvent<EventTarget>;
  createEvent(eventInterface: "PromiseRejectionEvent"): PromiseRejectionEvent;
  createEvent(eventInterface: "RTCDTMFToneChangeEvent"): RTCDTMFToneChangeEvent;
  createEvent(eventInterface: "RTCDataChannelEvent"): RTCDataChannelEvent;
  createEvent(eventInterface: "RTCErrorEvent"): RTCErrorEvent;
  createEvent(
    eventInterface: "RTCPeerConnectionIceErrorEvent",
  ): RTCPeerConnectionIceErrorEvent;
  createEvent(
    eventInterface: "RTCPeerConnectionIceEvent",
  ): RTCPeerConnectionIceEvent;
  createEvent(eventInterface: "RTCTrackEvent"): RTCTrackEvent;
  createEvent(
    eventInterface: "SecurityPolicyViolationEvent",
  ): SecurityPolicyViolationEvent;
  createEvent(
    eventInterface: "SpeechSynthesisErrorEvent",
  ): SpeechSynthesisErrorEvent;
  createEvent(eventInterface: "SpeechSynthesisEvent"): SpeechSynthesisEvent;
  createEvent(eventInterface: "StorageEvent"): StorageEvent;
  createEvent(eventInterface: "SubmitEvent"): SubmitEvent;
  createEvent(eventInterface: "TouchEvent"): TouchEvent;
  createEvent(eventInterface: "TrackEvent"): TrackEvent;
  createEvent(eventInterface: "TransitionEvent"): TransitionEvent;
  createEvent(eventInterface: "UIEvent"): UIEvent;
  createEvent(eventInterface: "UIEvents"): UIEvent;
  createEvent(eventInterface: "WebGLContextEvent"): WebGLContextEvent;
  createEvent(eventInterface: "WheelEvent"): WheelEvent;
  createEvent(eventInterface: string): Event;
  createEvent(eventInterface: unknown):
    | Event
    | AnimationEvent
    | AnimationPlaybackEvent
    | AudioProcessingEvent
    | BeforeUnloadEvent
    | BlobEvent
    | ClipboardEvent
    | CloseEvent
    | CompositionEvent
    | UIEvent
    | CustomEvent<any>
    | DeviceMotionEvent
    | DeviceOrientationEvent
    | DragEvent
    | MouseEvent
    | ErrorEvent
    | FocusEvent
    | FontFaceSetLoadEvent
    | FormDataEvent
    | GamepadEvent
    | HashChangeEvent
    | IDBVersionChangeEvent
    | InputEvent
    | KeyboardEvent
    | MIDIConnectionEvent
    | MIDIMessageEvent
    | MediaEncryptedEvent
    | MediaKeyMessageEvent
    | MediaQueryListEvent
    | MediaStreamTrackEvent
    | MessageEvent<any>
    | MutationEvent
    | OfflineAudioCompletionEvent
    | PageTransitionEvent
    | PaymentMethodChangeEvent
    | PaymentRequestUpdateEvent
    | PictureInPictureEvent
    | PointerEvent
    | PopStateEvent
    | ProgressEvent<EventTarget>
    | PromiseRejectionEvent
    | RTCDTMFToneChangeEvent
    | RTCDataChannelEvent
    | RTCErrorEvent
    | RTCPeerConnectionIceErrorEvent
    | RTCPeerConnectionIceEvent
    | RTCTrackEvent
    | SecurityPolicyViolationEvent
    | SpeechSynthesisErrorEvent
    | SpeechSynthesisEvent
    | StorageEvent
    | SubmitEvent
    | TouchEvent
    | TrackEvent
    | TransitionEvent
    | WebGLContextEvent
    | WheelEvent {
    throw new UnImplemented();
  }

  createNodeIterator(
    root: Node,
    whatToShow?: number | undefined,
    filter?: NodeFilter | null | undefined,
  ): NodeIterator {
    throw new UnImplemented();
  }

  createProcessingInstruction(
    target: string,
    data: string,
  ): ProcessingInstruction {
    throw new UnImplemented();
  }

  createRange(): Range {
    throw new UnImplemented();
  }

  createTextNode(data: string): Text {
    return new Text(data);
  }

  createTreeWalker(
    root: Node,
    whatToShow?: number | undefined,
    filter?: NodeFilter | null | undefined,
  ): TreeWalker {
    throw new UnImplemented();
  }

  execCommand(
    commandId: string,
    showUI?: boolean | undefined,
    value?: string | undefined,
  ): boolean {
    throw new UnImplemented();
  }

  exitFullscreen(): Promise<void> {
    throw new UnImplemented();
  }

  exitPictureInPicture(): Promise<void> {
    throw new UnImplemented();
  }

  exitPointerLock(): void {
    throw new UnImplemented();
  }

  getElementsByName(elementName: string): NodeListOf<HTMLElement> {
    throw new UnImplemented();
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-getelementsbytagname
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
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(
    qualifiedName: string,
  ):
    | HTMLCollectionOf<HTMLElementTagNameMap[K]>
    | HTMLCollectionOf<SVGElementTagNameMap[K]>
    | HTMLCollectionOf<MathMLElementTagNameMap[K]>
    | HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>
    | HTMLCollectionOf<Element> {
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
  ): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(
    namespace: unknown,
    localName: unknown,
  ):
    | HTMLCollectionOf<HTMLElement>
    | HTMLCollectionOf<SVGElement>
    | HTMLCollectionOf<MathMLElement>
    | HTMLCollectionOf<Element> {
    throw new UnImplemented();
  }

  getSelection(): Selection | null {
    throw new UnImplemented();
  }

  hasFocus(): boolean {
    throw new UnImplemented();
  }

  hasStorageAccess(): Promise<boolean> {
    throw new UnImplemented();
  }

  importNode<T extends Node>(node: T, deep?: boolean | undefined): T {
    throw new UnImplemented();
  }

  open(
    unused1?: string | undefined,
    unused2?: string | undefined,
  ): globalThis.Document;
  open(url: string | URL, name: string, features: string): Window | null;
  open(
    url?: unknown,
    name?: unknown,
    features?: unknown,
  ): globalThis.Document | Window | null {
    throw new UnImplemented();
  }

  queryCommandEnabled(commandId: string): boolean {
    throw new UnImplemented();
  }

  queryCommandIndeterm(commandId: string): boolean {
    throw new UnImplemented();
  }

  queryCommandState(commandId: string): boolean {
    throw new UnImplemented();
  }

  queryCommandSupported(commandId: string): boolean {
    throw new UnImplemented();
  }

  queryCommandValue(commandId: string): string {
    throw new UnImplemented();
  }

  releaseEvents(): void {
    throw new UnImplemented();
  }

  requestStorageAccess(): Promise<void> {
    throw new UnImplemented();
  }

  write(...text: string[]): void {
    throw new UnImplemented();
  }

  writeln(...text: string[]): void {
    throw new UnImplemented();
  }
}

export interface Document
  extends
    DocumentOrShadowRoot,
    FontFaceSource,
    IParentNode,
    NonElementParentNode,
    XPathEvaluatorBase {}

/**
 * @see https://dom.spec.whatwg.org/#internal-createelementns-steps
 */
export function internalCreateElement(
  document: Document,
  namespace: Namespace | null,
  qualifiedName: string,
  options?: string | ElementCreationOptions,
): Element {
  // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName to validate and extract.
  const { namespace: $namespace, prefix, localName } = validateAndExtract(
    namespace,
    qualifiedName,
  );

  // 2. Let is be null.
  let is: string | null = null;

  // 3. If options is a dictionary and options["is"] exists, then set is to it.
  if (typeof options === "object" && "is" in options) {
    is = options["is"] ?? null;
  }

  // 4. Return the result of creating an element given document, localName, namespace, prefix, is, and with the synchronous custom elements flag set.
  return createElement(document, localName, $namespace, prefix, is);
}
