import { Node, NodeType } from "../node.ts";
import {
  getElementsByClassName,
  getElementsByNamespaceAndLocalName,
  getElementsByQualifiedName,
} from "../node_utils.ts";
import { ParentNode } from "../node_trees/parent_node.ts";
import { DocumentOrShadowRoot } from "../node_trees/document_or_shadow_root.ts";
import { XPathEvaluatorBase } from "../../../dom/xpath/x_path_evaluator_base.ts";
import {
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isShadowRoot,
} from "../utils.ts";
import { Attr } from "../elements/attr.ts";
import { Text } from "../text.ts";
import { Comment } from "../comment.ts";
import { createElement } from "../elements/element_algorithm.ts";
import { type Element } from "../elements/element.ts";
import { Namespace, validateAndExtract } from "../../../infra/namespace.ts";
import { DocumentFragment } from "../document_fragment.ts";
import { NonElementParentNode } from "../node_trees/non_element_parent_node.ts";
import type { IDocument, IXMLDocument } from "../../../interface.d.ts";
import { type DocumentType } from "../document_type.ts";
import { find, html, xmlValidator } from "../../../deps.ts";
import { ProcessingInstruction } from "../processing_instruction.ts";
import { DOMImplementation } from "../documents/dom_implementation.ts";
import { DOMExceptionName } from "../../../webidl/exception.ts";
import { CDATASection } from "../cdata_section.ts";
import { GlobalEventHandlers } from "../../../html/global_event_handlers.ts";
import { FontFaceSource } from "../../../css/css_font_loading/font_face_source.ts";
import { Document_HTML } from "../../../html/document.ts";
import { Document_CSSOM_View } from "../../../cssom_view/document.ts";
import { Document_Picture_In_Picture } from "../../../picture_in_picture/document.ts";
import { Document_Fullscreen } from "../../../fullscreen/document.ts";
import { Document_Pointerlock } from "../../../pointerlock/document.ts";
import { Document_Selection } from "../../../selection/document.ts";
import { Document_Storage_Access_API } from "../../../storage_access_api/document.ts";
import { Document_WebAnimation } from "../../../web_animations/document.ts";
import { Document_SVG } from "../../../svg/document.ts";
import { ReName } from "../../../xml/document.ts";
import { getDocumentElement } from "../node_trees/node_tree.ts";
import { convert, DOMString } from "../../../webidl/types.ts";
import { adoptNode } from "../node_trees/mutation.ts";
import { toASCIILowerCase } from "../../../infra/string.ts";
import { Range } from "../../ranges/range.ts";
import { type Encoding, utf8 } from "../../../encoding/encoding.ts";
import {
  NodeIterator,
  NodeIteratorInternals,
} from "../../traversals/node_iterator.ts";
import {
  TreeWalker,
  TreeWalkerInternals,
} from "../../traversals/tree_walker.ts";
import { createEvent } from "../../events/construct.ts";
import { Event } from "../../events/event.ts";
import { CustomEvent } from "../../events/custom_event.ts";
import { $, internalSlots, tree } from "../../../internal.ts";
import { internalCreateElement, isHTMLDocument } from "./document_utils.ts";

export type Origin = OpaqueOrigin | TupleOrigin;

export interface OpaqueOrigin {
  type: "opaque";
}

const opaqueOrigin: OpaqueOrigin = {
  type: "opaque",
};

export interface TupleOrigin {
  type: "tuple";
}

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
  constructor() {
    // @ts-ignore
    super();

    const _ = Object.assign(
      this._,
      new DocumentInternals({
        implementation: DOMImplementation["create"](this),
      }),
      { nodeDocument: this },
    );

    this._ = _;
    internalSlots.set(this, _);
  }

  declare protected _: DocumentInternals & Node["_"];

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

  protected override clone(document: globalThis.Document): globalThis.Document {
    const doc = new (this.constructor as typeof globalThis.Document)();

    $(doc).type = $(document).type;
    $(doc).contentType = $(document).contentType;

    return doc;
  }

  /**
   * @see https://triple-underscore.github.io/DOM4-ja.html#dom-document-url
   */
  get URL(): string {
    // return this’s URL, serialized.
    return this._.URL.href;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-characterset
   */
  get characterSet(): string {
    // return this’s encoding’s name.
    return this._.encoding.name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-charset
   */
  get charset(): string {
    // return this’s encoding’s name.
    return this._.encoding.name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-compatmode
   */
  get compatMode(): CompatMode {
    // return "BackCompat" if this’s mode is "quirks"; otherwise "CSS1Compat".
    switch (this._.mode) {
      case html.DOCUMENT_MODE.QUIRKS:
        return "BackCompat";
      default:
        return "CSS1Compat";
    }
  }

  get contentType(): string {
    return this._.contentType;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-doctype
   */
  get doctype(): DocumentType | null {
    // return the child of this that is a doctype; otherwise null.
    return (find(tree.children(this), isDocumentType) ?? null) as
      | DocumentType
      | null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-documentelement
   * @note May return `null` in the specification.
   */
  get documentElement(): HTMLElement { // Specification is Element | null
    return getDocumentElement(this) as any as HTMLElement;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-documenturi
   */
  get documentURI(): string {
    // return this’s URL, serialized.
    return this._.URL.href;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-implementation
   */
  get implementation(): DOMImplementation {
    // return the DOMImplementation object that is associated with this.
    return this._.implementation;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-inputencoding
   */
  get inputEncoding(): string {
    // return this’s encoding’s name.
    return this._.encoding.name;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): null {
    // return null, if this is a document
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-adoptnode
   */
  adoptNode<T extends globalThis.Node>(node: T): T {
    // 1. If node is a document, then throw a "NotSupportedError" DOMException.
    if (isDocument(node)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
    if (isShadowRoot(node)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.HierarchyRequestError,
      );
    }

    // 3. If node is a DocumentFragment node whose host is non-null, then return.
    if (isDocumentFragment(node) && $(node).host) return node; // TODO(miyauci): Check return null or not.

    // 4. Adopt node into this.
    adoptNode(node, this);

    // 5. Return node.
    return node;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createattribute
   */
  @convert
  createAttribute(@DOMString localName: string): globalThis.Attr {
    // 1. If localName does not match the Name production in XML, then throw an "InvalidCharacterError" DOMException.
    if (!xmlValidator.name(localName)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If this is an HTML document, then set localName to localName in ASCII lowercase.
    if (isHTMLDocument(this)) localName = toASCIILowerCase(localName);

    // 3. Return a new attribute whose local name is localName and node document is this.
    return new Attr({ localName, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createattributens
   */
  createAttributeNS(
    namespace: string | null,
    qualifiedName: string,
  ): globalThis.Attr {
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
  @convert
  createCDATASection(@DOMString data: string): CDATASection {
    // 1. If this is an HTML document, then throw a "NotSupportedError" DOMException.
    if (isHTMLDocument(this)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 2. If data contains the string "]]>", then throw an "InvalidCharacterError" DOMException.
    if (data.includes("]]>")) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 3. Return a new CDATASection node with its data set to data and node document set to this.
    return CDATASection["create"]({ data, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createcomment
   */

  @convert
  createComment(@DOMString data: string): Comment {
    // return a new Comment node whose data is data and node document is this.
    return Comment["create"]({ data, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createdocumentfragment
   */
  createDocumentFragment(): globalThis.DocumentFragment {
    // return a new DocumentFragment node whose node document is this.
    return DocumentFragment["create"]({ nodeDocument: this });
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
  createElement(
    tagName: string,
    options?: ElementCreationOptions,
  ): HTMLElement {
    // 1. If localName does not match the Name production, then throw an "InvalidCharacterError" DOMException.
    if (!ReName.test(tagName)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If this is an HTML document, then set localName to localName in ASCII lowercase.
    if (isHTMLDocument(this)) tagName = toASCIILowerCase(tagName);

    // 3. Let is be null.
    let is: string | null = null;

    // 4. If options is a dictionary and options["is"] exists, then set is to it.
    if (options && typeof options.is === "string") is = options.is;

    // 5. Let namespace be the HTML namespace, if this is an HTML document or this’s content type is "application/xhtml+xml"; otherwise null.
    const namespace =
      (isHTMLDocument(this) || this._.contentType === "application/xhtml+xml")
        ? Namespace.HTML
        : null;

    // 6. Return the result of creating an element given this, localName, namespace, null, is, and with the synchronous custom elements flag set.
    return createElement(
      this,
      tagName,
      namespace,
      null,
      is,
      true,
    ) as any as HTMLElement;
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
    options?: ElementCreationOptions,
  ): Element;
  createElementNS(
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions,
  ): Element;
  createElementNS(
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions,
  ): any {
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
  createEvent(eventInterface: string): globalThis.Event {
    // 1. Let constructor be null.
    let constructor: typeof globalThis.Event | null = null;

    const lowercase = toASCIILowerCase(eventInterface);
    // 2. If interface is an ASCII case-insensitive match for any of the strings in the first column in the following table, then set constructor to the interface in the second column on the same row as the matching string:
    if (eventMap.has(lowercase)) constructor = eventMap.get(lowercase)!;

    // 3. If constructor is null, then throw a "NotSupportedError" DOMException.
    if (!constructor) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 4. If the interface indicated by constructor is not exposed on the relevant global object of this, then throw a "NotSupportedError" DOMException.

    // 5. Let event be the result of creating an event given constructor.
    const event = createEvent(constructor as typeof Event);

    // 6. Initialize event’s type attribute to the empty string.
    $(event).type = "";

    // 7. Initialize event’s timeStamp attribute to the result of calling current high resolution time with this’s relevant global object.

    // 8. Initialize event’s isTrusted attribute to false.
    $(event).isTrusted = false;

    // 9. Unset event’s initialized flag.
    $(event).initialized = false;

    // 10. Return event.
    return event;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-document-createnodeiterator)
   */
  createNodeIterator(
    root: Node,
    whatToShow = 0xFFFFFFFF, // TODO unsigned long
    filter: NodeFilter | null = null,
  ): NodeIterator {
    // 1. Let iterator be a new NodeIterator object.
    const iterator = new NodeIterator();
    const _ = new NodeIteratorInternals({
      // 2. Set iterator’s root and iterator’s reference to root.
      root,
      reference: root,
      // 3. Set iterator’s pointer before reference to true.
      pointerBeforeReference: true,
      // 4. Set iterator’s whatToShow to whatToShow.
      whatToShow,
      // 5. Set iterator’s filter to filter.
      filter,
    });
    internalSlots.set(iterator, _);

    // 6. Return iterator.
    return iterator;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction
   */
  @convert
  createProcessingInstruction(
    @DOMString target: string,
    @DOMString data: string,
  ): ProcessingInstruction {
    // 1. If target does not match the Name production, then throw an "InvalidCharacterError" DOMException.
    if (!ReName.test(target)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If data contains the string "?>", then throw an "InvalidCharacterError" DOMException.
    if (data.includes("?>")) {
      throw new DOMException("<message>", "InvalidCharacterError");
    }

    // 3. Return a new ProcessingInstruction node, with target set to target, data set to data, and node document set to this.
    return new ProcessingInstruction({ data, target, nodeDocument: this });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createrange
   */
  createRange(): Range {
    // return a new live range with (this, 0) as its start an end.
    const range = new Range();
    $(range).start = [this, 0], $(range).end = [this, 0];

    return range;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-createtextnode
   */
  @convert
  createTextNode(@DOMString data: string): Text {
    // return a new Text node whose data is data and node document is this.
    return Text["create"]({ data, nodeDocument: this });
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-document-createtreewalker)
   */
  createTreeWalker(
    root: Node,
    whatToShow = 0xFFFFFFFF,
    filter: NodeFilter | null = null,
  ): TreeWalker {
    // 1. Let walker be a new TreeWalker object.
    const walker = new TreeWalker();
    const _ = new TreeWalkerInternals({
      // 2. Set walker’s root and walker’s current to root.
      root,
      current: root,
      // 3. Set walker’s whatToShow to whatToShow.
      whatToShow,
      // 4. Set walker’s filter to filter.
      filter,
    });
    internalSlots.set(walker, _);

    // 5. Return walker.
    return walker;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-getelementsbyclassname
   */
  @convert
  getElementsByClassName(
    @DOMString classNames: string,
  ): HTMLCollection {
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
  getElementsByTagName(qualifiedName: string): HTMLCollection {
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
  ): HTMLCollection {
    return getElementsByNamespaceAndLocalName(
      namespace,
      localName,
      this,
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-document-importnode
   */
  importNode<T>(node: T & Node, deep = false): T {
    // 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
    if (isDocument(node) || isShadowRoot(node)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // TODO(miyauci): improve dirty re-assignment
    const document = $(node).nodeDocument;
    $(node).nodeDocument = this;
    // 2. Return a clone of node, with this and the clone children flag set if deep is true.
    const copy = node.cloneNode(deep) as T;
    $(node).nodeDocument = document;

    return copy;
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

export class DocumentInternals {
  /**
   * @default utf8
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-encoding)
   */
  encoding: Encoding = utf8;

  /**
   * @default "application/xml"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-content-type)
   */
  contentType = "application/xml";

  /**
   * @default new URL("about:blank")
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-url)
   */
  URL: URL = new URL("about:blank");

  /**
   * @default OpaqueOrigin
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-origin)
   */
  origin: Origin = opaqueOrigin;

  /**
   * @default "xml"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-type)
   */
  type: "xml" | "html" = "xml";

  /**
   * @default "no-quirks"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-mode)
   */
  mode: html.DOCUMENT_MODE = html.DOCUMENT_MODE.NO_QUIRKS;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#interface-domimplementation)
   */
  implementation: DOMImplementation;

  constructor(
    { implementation }: Pick<DocumentInternals, "implementation">,
  ) {
    this.implementation = implementation;
  }
}

export class XMLDocument extends Document implements IXMLDocument {}

/**
 * | String                   | Interface Notes        |
 * | ------------------------ | ---------------------- |
 * | "beforeunloadevent"      | BeforeUnloadEvent      |
 * | "compositionevent"       | CompositionEvent       |
 * | "customevent"            | CustomEvent            |
 * | "devicemotionevent"      | DeviceMotionEvent      |
 * | "deviceorientationevent" | DeviceOrientationEvent |
 * | "dragevent"              | DragEvent              |
 * | "event"                  | Event                  |
 * | "events"                 | Event                  |
 * | "focusevent"             | FocusEvent             |
 * | "hashchangeevent"        | HashChangeEvent        |
 * | "htmlevents"             | Event                  |
 * | "keyboardevent"          | KeyboardEvent          |
 * | "messageevent"           | MessageEvent           |
 * | "mouseevent"             | MouseEvent             |
 * | "mouseevents"            | MouseEvent             |
 * | "storageevent"           | StorageEvent           |
 * | "svgevents"              | Event                  |
 * | "textevent"              | CompositionEvent       |
 * | "touchevent"             | TouchEvent             |
 * | "uievent"                | UIEvent                |
 * | "uievents"               | UIEvent                |
 */
const eventMap = new Map<string, typeof Event>(
  [
    ["customevent", CustomEvent],
    ["event", Event],
    ["events", Event],
    ["htmlevents", Event],
    ["svgevents", Event],
  ],
);
