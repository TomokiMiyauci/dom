import { Text } from "../dom/nodes/text.ts";
import { Attr } from "../dom/nodes/elements/attr.ts";
import { isText } from "../dom/nodes/utils.ts";
import { setAttributeValue } from "../dom/nodes/utils/set_attribute_value.ts";
import { DocumentType } from "../dom/nodes/document_type.ts";
import { html, Token, TreeAdapter, TreeAdapterTypeMap } from "../deps.ts";
import { $, internalSlots } from "../internal.ts";
import { appropriateTemplateContentsOwnerDocument } from "./elements/html_template_element_utils.ts";

type Child = Node & ChildNode;

export type DOMTreeAdapterMap = TreeAdapterTypeMap<
  Node,
  ParentNode,
  ChildNode,
  Document,
  DocumentFragment,
  Element,
  Comment,
  Text,
  HTMLTemplateElement,
  DocumentType
>;

export class DOMTreeAdapter implements TreeAdapter<DOMTreeAdapterMap> {
  constructor(public document: Document) {}

  createDocument(): Document {
    return this.document;
  }

  createDocumentFragment(): DocumentFragment {
    return this.document.createDocumentFragment();
  }

  createElement(
    tagName: string,
    namespaceURI: html.NS,
    attrs: Token.Attribute[],
  ): Element {
    const element = this.document.createElementNS(namespaceURI, tagName);
    const attributes = attrs.map((attribute) =>
      AttrConvertor.to(attribute, this.document)
    );

    attributes.forEach(element.setAttributeNode.bind(element));

    return element;
  }

  createCommentNode(data: string): Comment {
    return this.document.createComment(data);
  }

  getCommentNodeContent(commentNode: Comment): string {
    return commentNode.data;
  }

  setTemplateContent(
    templateElement: HTMLTemplateElement,
    contentElement: DocumentFragment,
  ): void {
    const { nodeDocument } = $(templateElement);
    // 1. Let doc be the template element's node document's appropriate template contents owner document.
    const doc = appropriateTemplateContentsOwnerDocument(nodeDocument);

    // 2. Create a DocumentFragment object whose node document is doc and host is the template element.
    const fragment = this.document.createDocumentFragment();
    $(fragment).nodeDocument = doc;
    $(fragment).host = templateElement;

    // 3. Set the template element's template contents to the newly created DocumentFragment object.
    internalSlots.extends<HTMLTemplateElement>(templateElement, {
      templateContents: fragment,
    });

    $(contentElement).nodeDocument = $(fragment).nodeDocument;
    $(contentElement).host = $(fragment).host;
    $(templateElement).templateContents = contentElement;
  }

  getTemplateContent(templateElement: HTMLTemplateElement): DocumentFragment {
    return templateElement.content;
  }

  setDocumentType(
    document: Document,
    name: string,
    publicId: string,
    systemId: string,
  ): void {
    const documentType = new DocumentType();
    $(documentType).name = name,
      $(documentType).publicId = publicId,
      $(documentType).systemId = systemId,
      $(documentType).nodeDocument = document;

    document.appendChild(documentType);
  }

  setDocumentMode(
    document: globalThis.Document,
    mode: html.DOCUMENT_MODE,
  ): void {
    $(document).mode = mode;
  }

  getDocumentMode(document: Document): html.DOCUMENT_MODE {
    return $(document).mode;
  }

  insertText(parentNode: Element, text: string): void {
    if (parentNode.childNodes.length) {
      const lastChild = parentNode.lastChild;

      if (lastChild && isText(lastChild)) {
        lastChild.data += text;
        return;
      }
    }

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
    for (const attr of attrs) {
      const { name, namespace, prefix, value } = attr;
      setAttributeValue(recipient, name, value, prefix, namespace);
    }
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
    return $(element).qualifiedName;
  }

  getTextNodeContent(textNode: Text): string {
    return textNode.data;
  }

  getAttrList(element: Element): Token.Attribute[] {
    return [...element.attributes].map(AttrConvertor.from.bind(AttrConvertor));
  }

  getChildNodes(node: Element): Child[] {
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

    // TODO(miyauci) When the namespaceURI is not well-known, what should do.
    // Since the parser accepts an unknown namespaceURI, should the serializer also do so?
    return element.namespaceURI as html.NS;
  }

  getFirstChild(node: Element): ChildNode | null {
    return node.firstChild;
  }

  getParentNode(node: Node): Element | null {
    return node.parentElement as any;
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

class AttrConvertor {
  static from(attr: globalThis.Attr): Token.Attribute {
    return {
      name: attr.localName,
      namespace: attr.namespaceURI ?? undefined,
      prefix: attr.prefix ?? undefined,
      value: attr.value,
    };
  }

  static to(attribute: Token.Attribute, document: Document): Attr {
    const attr = new Attr();
    if (attribute.namespace) $(attr).namespace = attribute.namespace;
    if (attribute.prefix) $(attr).namespacePrefix = attribute.prefix;
    $(attr).localName = attribute.name;
    $(attr).value = attribute.value;
    $(attr).nodeDocument = document;

    return attr;
  }
}
