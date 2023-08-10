import { Node, NodeType } from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { DocumentOrShadowRoot } from "./document_or_shadow_root.ts";
import { FontFaceSource } from "./font_face_source.ts";
import { XPathEvaluatorBase } from "./x_path_evaluator_base.ts";
import { UnImplemented } from "./utils.ts";
import { Attr } from "./attr.ts";
import { Text } from "./text.ts";
import { Comment } from "./comment.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { type IDocument } from "../interface.d.ts";
import { type DocumentType } from "./document_type.ts";

export class Document extends Node implements IDocument {
  override get nodeType(): NodeType.DOCUMENT_NODE {
    return NodeType.DOCUMENT_NODE;
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

  URL: string = "";

  alinkColor: string = "";
  all: any;
  anchors: any;
  applets: any;
  bgColor: string = "";
  body: any;
  characterSet: string = "";
  charset: string = "";

  readonly compatMode: string = "";
  contentType: string = "";
  cookie: string = "";
  currentScript: any | null;
  defaultView: any;
  designMode: string = "";
  dif = "";
  doctype: DocumentType | null = null;
  documentElement: any;
  documentURI: string = "";
  domain: string = "";
  dir: string = "";
  embeds: any;
  fgColor: string = "";
  forms: any;
  fullscreen: boolean = false;
  fullscreenEnabled: boolean = false;
  head: any;
  hidden: boolean = false;
  images: any;
  implementation: any;
  inputEncoding: string = "";
  lastModified: string = "";
  linkColor: string = "";
  links: any;
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
  get ownerDocument(): null {
    return null;
  }

  pictureInPictureEnabled: boolean = false;

  plugins: any;

  readyState: DocumentReadyState = "complete";
  referrer: string = "";
  rootElement: any | null;
  scripts: any;
  scrollingElement: any | null = null;
  timeline: any;
  title: string = "";
  visibilityState: DocumentVisibilityState = "hidden";
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
    tagName: unknown,
    options?: unknown,
  ):
    | HTMLElementTagNameMap[K]
    | HTMLElementDeprecatedTagNameMap[K]
    | HTMLElement {
    throw new UnImplemented();
  }
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
    namespace: unknown,
    qualifiedName: unknown,
    options?: unknown,
  ):
    | HTMLElement
    | Element
    | SVGElementTagNameMap[K]
    | SVGElement
    | MathMLElementTagNameMap[K]
    | MathMLElement {
    throw new UnImplemented();
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

  getElementById(elementId: string): any | null {
    throw new UnImplemented();
  }

  getElementsByName(elementName: string): NodeListOf<HTMLElement> {
    throw new UnImplemented();
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
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
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(
    qualifiedName: unknown,
  ):
    | HTMLCollectionOf<HTMLElementTagNameMap[K]>
    | HTMLCollectionOf<SVGElementTagNameMap[K]>
    | HTMLCollectionOf<MathMLElementTagNameMap[K]>
    | HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>
    | HTMLCollectionOf<Element> {
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
    NonElementParentNode,
    ParentNode,
    XPathEvaluatorBase {}
