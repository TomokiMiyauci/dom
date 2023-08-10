/// <reference lib="dom" />

export type IDocument = Omit<Document, keyof GlobalEventHandlers>;
export type IElement = Omit<
  Element,
  keyof ARIAMixin | keyof Animatable | keyof InnerHTML
>;
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
export type IXPathEvaluatorBase = XPathEvaluatorBase;
