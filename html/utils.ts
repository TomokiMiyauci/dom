import { Node } from "../nodes/node.ts";
import { Text } from "../nodes/text.ts";
import { Attr } from "../nodes/attr.ts";
import { Comment } from "../nodes/comment.ts";
import { Element } from "../nodes/element.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { DocumentType } from "../nodes/document_type.ts";
import { Document } from "../nodes/document.ts";
import { html, Token, TreeAdapter, TreeAdapterTypeMap } from "../deps.ts";

export type DOMTreeAdapterMap = TreeAdapterTypeMap<
  Node,
  ParentNode,
  ChildNode,
  Document,
  DocumentFragment,
  Element,
  Comment,
  Text,
  void,
  DocumentType
>;

export class DOMTreeAdapter implements TreeAdapter<DOMTreeAdapterMap> {
  createDocument(): Document {
    return new Document();
  }

  createDocumentFragment(): DocumentFragment {
    return new DocumentFragment();
  }

  createElement(
    tagName: string,
    namespaceURI: html.NS,
    attrs: Token.Attribute[],
  ): Element {
    const document = new Document();
    const element = document.createElement(tagName);
    const attributes = attrs.map((attribute) =>
      attrToAttribute(attribute, document)
    );

    attributes.forEach((attr) => {
      element.setAttributeNode(attr);
    });

    Object.defineProperty(element, "namespaceURI", { value: namespaceURI });

    return element;
  }

  createCommentNode(data: string): Comment {
    return new Comment(data);
  }

  getCommentNodeContent(commentNode: Comment): string {
    return commentNode.data;
  }

  setTemplateContent(
    templateElement: HTMLTemplateElement,
    contentElement: DocumentFragment,
  ): void {
    throw new Error("");
  }

  getTemplateContent(templateElement: HTMLTemplateElement): DocumentFragment {
    throw new Error("");
  }

  setDocumentType(
    document: Document,
    name: string,
    publicId: string,
    systemId: string,
  ): void {
    if (!document.childNodes.length) {
      const documentType = new DocumentType(name, publicId, systemId);

      document.appendChild(documentType);
    }
  }

  setDocumentMode(document: Document, mode: html.DOCUMENT_MODE): void {
    Object.defineProperty(document, "compatMode", { value: mode });
  }

  getDocumentMode(document: Document): html.DOCUMENT_MODE {
    return html.DOCUMENT_MODE.QUIRKS;
  }

  insertText(parentNode: Element, text: string): void {
    parentNode.appendChild(new Text(text));
  }

  insertBefore(
    parentNode: Element,
    newNode: ChildNode,
    referenceNode: ChildNode,
  ): void {
    console.log(2);
  }

  adoptAttributes(recipient: Element, attrs: Token.Attribute[]): void {
    console.log(2);
  }

  isTextNode(node: Node): node is Text {
    return node.nodeType === node.TEXT_NODE;
  }

  isCommentNode(node: Node): node is Comment {
    return node.nodeType === node.COMMENT_NODE;
  }

  isDocumentTypeNode(node: Node): node is DocumentType {
    return node.nodeType === node.DOCUMENT_TYPE_NODE;
  }

  isElementNode(node: Node): node is Element {
    return node.nodeType === node.ELEMENT_NODE;
  }

  insertTextBefore(
    parentNode: Element,
    text: string,
    referenceNode: ChildNode,
  ): void {
    console.log(2);
  }

  appendChild(parentNode: Element, newNode: ChildNode): void {
    parentNode.appendChild(newNode);
  }

  getTagName(element: Element): string {
    return element.tagName;
  }

  getTextNodeContent(textNode: Text): string {
    return textNode.data;
  }

  getAttrList(element: Element): Token.Attribute[] {
    return [];
  }

  getChildNodes(node: Element): ChildNode[] {
    return Array.from(node.childNodes);
  }

  getDocumentTypeNodeName(doctypeNode: DocumentType): string {
    return doctypeNode.nodeName;
  }

  getDocumentTypeNodePublicId(doctypeNode: DocumentType): string {
    return doctypeNode.publicId;
  }

  getDocumentTypeNodeSystemId(doctypeNode: DocumentType): string {
    return doctypeNode.systemId;
  }

  getNamespaceURI(element: Element): html.NS {
    return html.NS.HTML;
  }

  getFirstChild(node: Element): ChildNode | null {
    return node.firstChild;
  }

  getParentNode(node: Node): Element | null {
    return node.parentElement;
  }

  detachNode(node: ChildNode): void {}

  getNodeSourceCodeLocation(): Token.ElementLocation | null | undefined {
    return undefined;
  }
  setNodeSourceCodeLocation(): void {}

  updateNodeSourceCodeLocation(): void {}
}

function attrToAttribute(attr: Token.Attribute, document: Document): Attr {
  const attribute = new Attr({
    localName: attr.name,
    value: attr.value,
    nodeDocument: document,
  });

  return attribute;
}
