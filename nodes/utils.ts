import { NodeType } from "./node.ts";
import { $, internalSlots } from "../internal.ts";

export class UnImplemented extends Error {}

export interface NodeLike {
  nodeType: unknown;
}

export function isNodeLike(object: object): object is NodeLike {
  return "nodeType" in object;
}

export function isDocument(node: NodeLike): node is Document {
  return node.nodeType === NodeType.DOCUMENT_NODE;
}

export function isDocumentFragment(node: NodeLike): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}

export function isDocumentType(node: NodeLike): node is DocumentType {
  return node.nodeType === NodeType.DOCUMENT_TYPE_NODE;
}

export function isElement(node: NodeLike): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function isCharacterData(node: NodeLike): node is CharacterData {
  return internalSlots.has(node) &&
    "data" in internalSlots.get(node as CharacterData);
}

export function isAttr(node: NodeLike): node is Attr {
  return node.nodeType === NodeType.ATTRIBUTE_NODE;
}

export function isText(node: NodeLike): node is Text {
  return node.nodeType === NodeType.TEXT_NODE;
}

export function isComment(node: NodeLike): node is Comment {
  return node.nodeType === NodeType.COMMENT_NODE;
}

export function isProcessingInstruction(
  node: NodeLike,
): node is ProcessingInstruction {
  return node.nodeType === NodeType.COMMENT_NODE;
}

/** Whether the {@linkcode node} is {@linkcode ShadowRoot} or not. */
export function isShadowRoot(node: NodeLike): node is ShadowRoot {
  return isDocumentFragment(node) && !!$(node).host;
}

export type ShadowHost = Element & {
  _shadowRoot: ShadowRoot;
};

/**
 * @see https://dom.spec.whatwg.org/#element-shadow-host
 */
export function isShadowHost(element: Element): element is ShadowHost {
  // shadow root is non-null.
  return internalSlots.has(element) && !!internalSlots.get(element).shadowRoot;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-attribute-qualified-name
 * @see https://dom.spec.whatwg.org/#concept-element-qualified-name
 */
export function getQualifiedName(
  localName: string,
  namespacePrefix: string | null,
): string {
  return strQualifiedName(localName, namespacePrefix);
}

export function strQualifiedName(localName: string, prefix?: unknown): string {
  return typeof prefix === "string" ? `${prefix}:${localName}` : localName;
}