/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

export type IDocument = Document;
export type IXMLDocument = XMLDocument;
export type IElement = Element;
export type INode = Node;
export type IAttr = Attr;
export type IText = Text;
export type IComment = Comment;
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
export type IXPathEvaluatorBase = XPathEvaluatorBase;
export type INodeList = NodeList;
export type IHTMLCollection = HTMLCollection;
export type IDOMImplementation = DOMImplementation;
export type ICDATASection = CDATASection;
export type IProcessingInstruction = ProcessingInstruction;
export type IShadowRoot = ShadowRoot;
export type IDOMTokenList = DOMTokenList;
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

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-custom-element-state)
 */
export type CustomElementState =
  | "undefined"
  | "failed"
  | "uncustomized"
  | "precustomized"
  | "custom";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-mode)
 */
export type CompatMode = "BackCompat" | "CSS1Compat";
