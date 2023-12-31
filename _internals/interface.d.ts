/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

export type IDocument = Document;
export type IXMLDocument = XMLDocument;
export type IElement = Element;
export type INode = Node;
export type IAttr = Attr;
export type IText = Text;
export type IComment = Comment;
export type IHTMLTemplateElement = HTMLTemplateElement;
export type IHTMLElement = HTMLElement;
export type IDocumentFragment = DocumentFragment;
export type INamedNodeMap = NamedNodeMap;
export type ICharacterData = CharacterData;
export type IDocumentType = DocumentType;
export type IChildNode = Omit<ChildNode, keyof Node>;
export type IParentNode = Omit<ParentNode, keyof Node>;
export type INonDocumentTypeChildNode = NonDocumentTypeChildNode;
export type ISlottable = Slottable;
export type INonElementParentNode = NonElementParentNode;
export type IDocumentOrShadowRoot = DocumentOrShadowRoot;
export type IFontFace = FontFace;
export type IFontFaceSource = FontFaceSource;
export type IFontFaceSet = FontFaceSet;
export type IXPathEvaluatorBase = XPathEvaluatorBase;
export type INodeList = NodeList;
export type IHTMLCollection = HTMLCollection;
export type IDOMParser = DOMParser;
export type IDOMImplementation = DOMImplementation;
export type ICDATASection = CDATASection;
export type IARIAMixin = ARIAMixin;
export type IAnimatable = Animatable;
export type IInnerHTML = InnerHTML;
export type IGlobalEventHandlers = GlobalEventHandlers;
export type IProcessingInstruction = ProcessingInstruction;
export type ILinkStyle = LinkStyle;
export type IShadowRoot = ShadowRoot;
export type IElementContentEditable = ElementContentEditable;
export type IHTMLOrSVGElement = HTMLOrSVGElement;
export type IElementCSSInlineStyle = ElementCSSInlineStyle;
export type IHTMLUnknownElement = HTMLUnknownElement;
export type IHTMLHtmlElement = HTMLHtmlElement;
export type IHTMLHeadElement = HTMLHeadElement;
export type IHTMLTitleElement = HTMLTitleElement;
export type IHTMLBodyElement = HTMLBodyElement;
export type IWindowEventHandlers = WindowEventHandlers;

export type IDOMTokenList = DOMTokenList;
export type IHTMLAnchorElement = HTMLAnchorElement;
export type IHTMLAreaElement = HTMLAreaElement;
export type IHTMLAudioElement = HTMLAudioElement;
export type IHTMLBaseElement = HTMLBaseElement;
export type IHTMLBRElement = HTMLBRElement;
export type IHTMLButtonElement = HTMLButtonElement;
export type IHTMLCanvasElement = HTMLCanvasElement;
export type IHTMLTableCaptionElement = HTMLTableCaptionElement;
export type IHTMLTableColElement = HTMLTableColElement;
export type IHTMLDataElement = HTMLDataElement;
export type IHTMLDataListElement = HTMLDataListElement;
export type IHTMLDialogElement = HTMLDialogElement;
export type IHTMLModElement = HTMLModElement;
export type IHTMLDirectoryElement = HTMLDirectoryElement;
export type IHTMLDivElement = HTMLDivElement;
export type IHTMLDListElement = HTMLDListElement;
export type IHTMLEmbedElement = HTMLEmbedElement;
export type IHTMLFieldSetElement = HTMLFieldSetElement;
export type IHTMLFontElement = HTMLFontElement;
export type IHTMLFormElement = HTMLFormElement;
export type IHTMLFrameElement = HTMLFrameElement;
export type IHTMLFrameSetElement = HTMLFrameSetElement;
export type IHTMLHeadingElement = HTMLHeadingElement;
export type IHTMLHRElement = HTMLHRElement;
export type IHTMLIFrameElement = HTMLIFrameElement;
export type IHTMLImageElement = HTMLImageElement;
export type IHTMLInputElement = HTMLInputElement;
export type IHTMLLabelElement = HTMLLabelElement;
export type IHTMLLegendElement = HTMLLegendElement;
export type IHTMLLIElement = HTMLLIElement;
export type IHTMLLinkElement = HTMLLinkElement;
export type IHTMLMapElement = HTMLMapElement;
export type IHTMLMetaElement = HTMLMetaElement;
export type IHTMLMeterElement = HTMLMeterElement;
export type IHTMLObjectElement = HTMLObjectElement;
export type IHTMLScriptElement = HTMLScriptElement;
export type IHTMLSelectElement = HTMLSelectElement;
export type IHTMLSourceElement = HTMLSourceElement;
export type IHTMLSpanElement = HTMLSpanElement;
export type IHTMLStyleElement = HTMLStyleElement;
export type IHTMLTableElement = HTMLTableElement;
export type IHTMLTableSectionElement = HTMLTableSectionElement;
export type IHTMLTableCellElement = HTMLTableCellElement;
export type IHTMLTextAreaElement = HTMLTextAreaElement;
export type IHTMLTimeElement = HTMLTimeElement;
export type IHTMLTableRowElement = HTMLTableRowElement;
export type IHTMLTrackElement = HTMLTrackElement;
export type IHTMLUListElement = HTMLUListElement;
export type IHTMLVideoElement = HTMLVideoElement;
export type IHTMLHyperlinkElementUtils = HTMLHyperlinkElementUtils;
export type IHTMLMediaElement = HTMLMediaElement;
export type IHTMLParagraphElement = HTMLParagraphElement;
export type IHTMLOListElement = HTMLOListElement;
export type IHTMLOptGroupElement = HTMLOptGroupElement;
export type IHTMLOptionElement = HTMLOptionElement;
export type IHTMLOutputElement = HTMLOutputElement;
export type IHTMLParamElement = HTMLParamElement;
export type IHTMLPreElement = HTMLPreElement;
export type IHTMLProgressElement = HTMLProgressElement;
export type IHTMLQuoteElement = HTMLQuoteElement;
export type ISVGElement = SVGElement;
export type ISVGGraphicsElement = SVGGraphicsElement;
export type ISVGAElement = SVGAElement;
export type ISVGTests = SVGTests;
export type ISVGURIReference = SVGURIReference;
export type ICSSStyleDeclaration = CSSStyleDeclaration;
export type IAbstractRange = AbstractRange;
export type IStaticRange = StaticRange;
export type IRange = Range;
export type IMutationObserver = MutationObserver;
export type IMutationRecord = MutationRecord;
export type INodeIterator = NodeIterator;
export type INodeFilter = typeof NodeFilter;
export type ITreeWalker = TreeWalker;
export type IEvent = Event;
export type ICustomEvent = CustomEvent;
export type IEventTarget = EventTarget;
export type IAbortController = AbortController;
export type IAbortSignal = AbortSignal;
export type ISelection = Selection;
export type IWindow = Omit<
  Window,
  | keyof WindowOrWorkerGlobalScope
  | keyof AnimationFrameProvider
  | keyof GlobalEventHandlers
  | keyof WindowEventHandlers
  | "Deno"
  | "Navigator"
  | "Location"
  | "localStorage"
  | "sessionStorage"
  | "add_completion_callback"
>;
export type ILocation = Location;
export type IMouseEvent = MouseEvent;
export type IUIEvent = UIEvent;
