import {
  getElementsByClassName,
  getElementsByQualifiedName,
  Node,
  NodeType,
} from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { DocumentOrShadowRoot } from "./document_or_shadow_root.ts";
import { XPathEvaluatorBase } from "../xpath/x_path_evaluator_base.ts";
import { isDocumentType, isElement, UnImplemented } from "./utils.ts";
import { Attr } from "./attr.ts";
import { Text } from "./text.ts";
import { Comment } from "./comment.ts";
import { createElement } from "./element_algorithm.ts";
import { type Element } from "./element.ts";
import { Namespace, validate, validateAndExtract } from "../infra/namespace.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { NonElementParentNode } from "./non_element_parent_node.ts";
import type { IDocument, IXMLDocument } from "../interface.d.ts";
import { type DocumentType } from "./document_type.ts";
import { find, html } from "../deps.ts";
import {
  $create,
  $encoding,
  $implementation,
  $mode,
  $nodeDocument,
  $origin,
  $URL,
} from "./internal.ts";
import { ProcessingInstruction } from "./processing_instruction.ts";
import { DOMImplementation } from "./dom_implementation.ts";
import { DOMExceptionName } from "../webidl/exception.ts";
import { CDATASection } from "./cdata_section.ts";
import { GlobalEventHandlers } from "../html/global_event_handlers.ts";
import { FontFaceSource } from "../css/css_font_loading/font_face_source.ts";
import { Document_HTML } from "../html/document.ts";
import { Document_CSSOM_View } from "../cssom_view/document.ts";
import { Document_Picture_In_Picture } from "../picture_in_picture/document.ts";
import { Document_Fullscreen } from "../fullscreen/document.ts";
import { Document_Pointerlock } from "../pointerlock/document.ts";
import { Document_Selection } from "../selection/document.ts";
import { Document_Storage_Access_API } from "../storage_access_api/document.ts";
import { Document_WebAnimation } from "../web_animations/document.ts";
import { Document_SVG } from "../svg/document.ts";
import { ReName } from "../xml/document.ts";

export interface Encoding {
  name: string;
  labels: string[];
}

export type Origin = OpaqueOrigin | TupleOrigin;

export interface OpaqueOrigin {
  type: "opaque";
}

export interface TupleOrigin {
  type: "tuple";
}

const utf8: Encoding = {
  name: "UTF-8",
  labels: [
    "unicode-1-1-utf-8",
    "unicode11utf8",
    "unicode20utf8",
    "utf-8",
    "utf8",
    "x-unicode20utf8",
  ],
};

export type CompatMode = "BackCompat" | "CSS1Compat";

@Document_HTML
@Document_CSSOM_View
@Document_Picture_In_Picture
@Document_Fullscreen
@Document_Pointerlock
@Document_Storage_Access_API
@DocumentOrShadowRoot
@Document_Selection
@Document_WebAnimation
@Document_SVG
@ParentNode
@NonElementParentNode
@GlobalEventHandlers
@FontFaceSource
@XPathEvaluatorBase
export class Document extends Node implements IDocument {
  _type: "xml" | "html" = "xml";
  _contentType: string = "application/xml";

  [$URL]: URL = new URL("about:blank");
  [$implementation]: DOMImplementation;
  [$origin]: Origin = { type: "opaque" };
  [$mode]: html.DOCUMENT_MODE = html.DOCUMENT_MODE.NO_QUIRKS;
  [$encoding]: Encoding = utf8;

  constructor() {
    super();

    this[$implementation] = DOMImplementation.create(this);
  }

  override get [$nodeDocument](): Document {
    return this;
  }

  override get nodeType(): NodeType.DOCUMENT_NODE {
    return NodeType.DOCUMENT_NODE;
  }

  override get nodeName(): "#document" {
    return "#document";
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
  override get textContent(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(_: unknown) {
    // noop
  }

  protected override equals(): true {
    return true;
  }

  protected override clone(document: Document): Document {
    const doc = new Document();

    doc._type = document._type;
    doc._contentType = document._contentType;

    return doc;
  }

  /**
   * @see https://triple-underscore.github.io/DOM4-ja.html#dom-document-url
   */
  get URL(): string {
    // return this’s URL, serialized.
    return this[$URL].href;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-characterset
   */
  get characterSet(): string {
    // return this’s encoding’s name.
    return this[$encoding].name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-charset
   */
  get charset(): string {
    // return this’s encoding’s name.
    return this[$encoding].name;
  }

  set charset(value: string) {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-compatmode
   */
  get compatMode(): CompatMode {
    // return "BackCompat" if this’s mode is "quirks"; otherwise "CSS1Compat".
    switch (this[$mode]) {
      case html.DOCUMENT_MODE.QUIRKS:
        return "BackCompat";
      default:
        return "CSS1Compat";
    }
  }

  get contentType(): string {
    return this._contentType;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-doctype
   */
  get doctype(): DocumentType | null {
    // return the child of this that is a doctype; otherwise null.
    return find(this._children, isDocumentType) ?? null;
  }

  get documentElement(): HTMLElement {
    for (const node of this._children) {
      if (isElement(node)) return node as HTMLElement;
    }

    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-documenturi
   */
  get documentURI(): string {
    // return this’s URL, serialized.
    return this[$URL].href;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-implementation
   */
  get implementation(): DOMImplementation {
    // return the DOMImplementation object that is associated with this.
    return this[$implementation];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-inputencoding
   */
  get inputEncoding(): string {
    // return this’s encoding’s name.
    return this[$encoding].name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): null {
    // return null, if this is a document
    return null;
  }

  adoptNode<T extends globalThis.Node>(node: T): T {
    throw new UnImplemented();
  }

  createAttribute(localName: string): Attr {
    return new Attr({ localName, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createattributens
   */
  createAttributeNS(namespace: string | null, qualifiedName: string): Attr {
    // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName to validate and extract.
    const { namespace: ns, prefix, localName } = validateAndExtract(
      namespace,
      qualifiedName,
    );

    // 2. Return a new attribute whose namespace is namespace, namespace prefix is prefix, local name is localName, and node document is this.
    return new Attr({
      localName,
      namespacePrefix: prefix,
      namespace: ns,
      nodeDocument: this,
    });
  }

  /**
   * @throws {@linkcode DOMException}
   *
   * @see https://dom.spec.whatwg.org/#dom-document-createcdatasection
   */
  createCDATASection(data: string): CDATASection {
    // 1. If this is an HTML document, then throw a "NotSupportedError" DOMException.
    if (isHTMLDocument(this)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 2. If data contains the string "]]>", then throw an "InvalidCharacterError" DOMException.
    if (data.includes("]]")) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 3. Return a new CDATASection node with its data set to data and node document set to this.
    return CDATASection[$create]({ data, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createcomment
   */
  createComment(data: string): Comment {
    // return a new Comment node whose data is data and node document is this.
    return Comment[$create]({ data, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createdocumentfragment
   */
  createDocumentFragment(): DocumentFragment {
    // return a new DocumentFragment node whose node document is this.
    return DocumentFragment[$create]({ nodeDocument: this });
  }

  /**
   * [DOM Living Standard](https://dom.spec.whatwg.org/#dom-document-createelement)
   */
  createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions,
  ): HTMLElementTagNameMap[K];
  createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions,
  ): HTMLElementDeprecatedTagNameMap[K];
  createElement(
    tagName: string,
    options?: ElementCreationOptions,
  ): HTMLElement;
  createElement(tagName: string, options?: ElementCreationOptions): Element {
    // 1. If localName does not match the Name production, then throw an "InvalidCharacterError" DOMException.
    if (!ReName.test(tagName)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If this is an HTML document, then set localName to localName in ASCII lowercase.
    if (isHTMLDocument(this)) tagName = tagName.toLowerCase();

    // 3. Let is be null.
    let is: string | null = null;

    // 4. If options is a dictionary and options["is"] exists, then set is to it.
    if (options && typeof options.is === "string") is = options.is;

    // 5. Let namespace be the HTML namespace, if this is an HTML document or this’s content type is "application/xhtml+xml"; otherwise null.
    const namespace =
      (isHTMLDocument(this) || this._contentType === "application/xhtml+xml")
        ? Namespace.HTML
        : null;

    // 6. Return the result of creating an element given this, localName, namespace, null, is, and with the synchronous custom elements flag set.
    return createElement(this, tagName, namespace, null, is, true);
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
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions | undefined,
  ): Element {
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
  createEvent(eventInterface: string): Event {
    throw new UnImplemented();
  }

  createNodeIterator(
    root: Node,
    whatToShow?: number | undefined,
    filter?: NodeFilter | null | undefined,
  ): NodeIterator {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction
   */
  createProcessingInstruction(
    target: string,
    data: string,
  ): ProcessingInstruction {
    // 1. If target does not match the Name production, then throw an "InvalidCharacterError" DOMException.
    if (!ReName.test(target)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If data contains the string "?>", then throw an "InvalidCharacterError" DOMException.
    if (data.includes("?")) {
      throw new DOMException("<message>", "InvalidCharacterError");
    }

    // 3. Return a new ProcessingInstruction node, with target set to target, data set to data, and node document set to this.
    return new ProcessingInstruction({ data, target, nodeDocument: this });
  }

  createRange(): Range {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createtextnode
   */
  createTextNode(data: string): Text {
    // return a new Text node whose data is data and node document is this.
    return Text[$create]({ data, nodeDocument: this });
  }

  createTreeWalker(
    root: Node,
    whatToShow?: number | undefined,
    filter?: NodeFilter | null | undefined,
  ): TreeWalker {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname
   */
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    // return the list of elements with class names classNames for this.
    return getElementsByClassName(classNames, this);
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
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element> {
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

  importNode<T>(node: T & Node, deep?: boolean | undefined): T {
    throw new UnImplemented();
  }
}

export interface Document
  extends
    DocumentOrShadowRoot,
    FontFaceSource,
    ParentNode,
    NonElementParentNode,
    XPathEvaluatorBase,
    GlobalEventHandlers,
    Document_HTML,
    Document_CSSOM_View,
    Document_Picture_In_Picture,
    Document_Fullscreen,
    Document_Pointerlock,
    Document_Selection,
    Document_Storage_Access_API,
    Document_WebAnimation,
    Document_SVG {
  getElementById(elementId: string): HTMLElement | null;
  addEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export class XMLDocument extends Document implements IXMLDocument {}

/**
 * @see https://dom.spec.whatwg.org/#internal-createelementns-steps
 */
export function internalCreateElement(
  document: Document,
  namespace: string | null,
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

/**
 * @see https://dom.spec.whatwg.org/#html-document
 */
export function isHTMLDocument(document: Document): boolean {
  // type is "xml"; otherwise an HTML document.
  return document._type !== "xml";
}
