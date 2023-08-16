import { Node } from "../nodes/node.ts";
import { Text } from "../nodes/text.ts";
import { Attr } from "../nodes/attr.ts";
import { Comment } from "../nodes/comment.ts";
import { Element } from "../nodes/element.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { DocumentType } from "../nodes/document_type.ts";
import { Document } from "../nodes/document.ts";
import { html, Token, TreeAdapter, TreeAdapterTypeMap } from "../deps.ts";
import { $mode } from "../nodes/internal.ts";

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
  constructor(public document: Document) {}

  createDocument(): Document {
    return this.document;
  }

  createDocumentFragment(): DocumentFragment {
    return this.createDocumentFragment();
  }

  createElement(
    tagName: string,
    namespaceURI: html.NS,
    attrs: Token.Attribute[],
  ): Element {
    const element = this.document.createElement(tagName);
    const attributes = attrs.map((attribute) =>
      AttrConvertor.to(attribute, this.document)
    );

    attributes.forEach(element.setAttributeNode.bind(element));

    Object.defineProperty(element, "namespaceURI", { value: namespaceURI });

    return element;
  }

  createCommentNode(data: string): Comment {
    return this.document.createComment(data);
  }

  getCommentNodeContent(commentNode: Comment): string {
    return commentNode.data;
  }

  setTemplateContent(
    templateElement: void,
    contentElement: DocumentFragment,
  ): void {
    throw new Error("setTemplateContent");
  }

  getTemplateContent(templateElement: void): DocumentFragment {
    throw new Error("getTemplateContent");
  }

  setDocumentType(
    document: Document,
    name: string,
    publicId: string,
    systemId: string,
  ): void {
    if (!document.childNodes.length) {
      const documentType = new DocumentType({
        name,
        publicId,
        systemId,
        nodeDocument: document,
      });

      document.appendChild(documentType);
    }
  }

  setDocumentMode(document: Document, mode: html.DOCUMENT_MODE): void {
    document[$mode] = mode;
  }

  getDocumentMode(document: Document): html.DOCUMENT_MODE {
    return document[$mode];
  }

  insertText(parentNode: Element, text: string): void {
    parentNode.appendChild(this.document.createTextNode(text));
  }

  insertBefore(
    parentNode: Element,
    newNode: ChildNode,
    referenceNode: ChildNode,
  ): void {
    throw new Error("insertBefore");
  }

  adoptAttributes(recipient: Element, attrs: Token.Attribute[]): void {
    throw new Error("adoptAttributes");
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
    throw new Error("insertTextBefore");
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
    return [...element.attributes].map(AttrConvertor.from.bind(AttrConvertor));
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
    if (element.namespaceURI === null) {
      throw new Error("namespaceURL does not exist");
    }
    assertNamespaceURL(element.namespaceURI);

    return element.namespaceURI;
  }

  getFirstChild(node: Element): ChildNode | null {
    return node.firstChild;
  }

  getParentNode(node: Node): Element | null {
    return node.parentElement;
  }

  detachNode(node: ChildNode): void {
    throw new Error("detachNode");
  }

  getNodeSourceCodeLocation(): Token.ElementLocation | null | undefined {
    return undefined;
  }
  setNodeSourceCodeLocation(): void {
    // noop
  }

  updateNodeSourceCodeLocation(): void {
    // noop
  }
}

const namespaceURLs = new Set<string>(Object.values(html.NS));

function assertNamespaceURL(
  namespaceURL: string,
): asserts namespaceURL is html.NS {
  if (!namespaceURLs.has(namespaceURL)) {
    throw new Error(`namespaceURL is invalid. ${namespaceURL}`);
  }
}

class AttrConvertor {
  static from(attr: Attr): Token.Attribute {
    if (attr.namespaceURI === null || attr.prefix === null) {
      throw new Error("attr namespaceURL or attr prefix is null");
    }

    return {
      name: attr.localName,
      namespace: attr.namespaceURI,
      prefix: attr.prefix,
      value: attr.value,
    };
  }

  static to(attribute: Token.Attribute, document: Document): Attr {
    const attr = new Attr({
      namespace: attribute.namespace,
      namespacePrefix: attribute.prefix,
      localName: attribute.name,
      value: attribute.value,
      nodeDocument: document,
    });

    return attr;
  }
}
