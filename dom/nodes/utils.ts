import {
  $data,
  $host,
  $localName,
  $namespacePrefix,
  $shadowRoot,
} from "./internal.ts";
import { NodeType } from "./node.ts";
import { type Text } from "./text.ts";
import { type Document } from "./documents/document.ts";
import { type DocumentFragment } from "./document_fragment.ts";
import { type DocumentType } from "./document_type.ts";
import { type Element } from "./elements/element.ts";
import { type Attr } from "./elements/attr.ts";
import { type Comment } from "./comment.ts";
import { type CharacterData } from "./character_data.ts";
import { type ShadowRoot } from "./shadow_root.ts";
import type { ProcessingInstruction } from "./processing_instruction.ts";

export class UnImplemented extends Error {}

interface NodeLike {
  nodeType: NodeType;
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
  return $data in node;
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
  return isDocumentFragment(node) && !!node[$host];
}

export interface ShadowHost extends Element {
  [$shadowRoot]: ShadowRoot;
}

/**
 * @see https://dom.spec.whatwg.org/#element-shadow-host
 */
export function isShadowHost(element: Element): element is ShadowHost {
  // shadow root is non-null.
  return !!element[$shadowRoot];
}

/**
 * @see https://dom.spec.whatwg.org/#concept-attribute-qualified-name
 * @see https://dom.spec.whatwg.org/#concept-element-qualified-name
 */
export function getQualifiedName(
  input: Readonly<{ [$namespacePrefix]: string | null; [$localName]: string }>,
): string {
  return strQualifiedName(input[$localName], input[$namespacePrefix]);
}

export function strQualifiedName(localName: string, prefix?: unknown): string {
  return typeof prefix === "string" ? `${prefix}:${localName}` : localName;
}
