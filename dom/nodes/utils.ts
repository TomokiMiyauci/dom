import {
  $data,
  $host,
  $localName,
  $namespacePrefix,
  $shadowRoot,
} from "./internal.ts";
import { type Node } from "./node.ts";
import { type Text } from "./text.ts";
import { type Document } from "./document.ts";
import { type DocumentFragment } from "./document_fragment.ts";
import { type DocumentType } from "./document_type.ts";
import { type Element } from "./element.ts";
import { type Attr } from "./attr.ts";
import { type Comment } from "./comment.ts";
import { type CharacterData } from "./character_data.ts";
import { type ShadowRoot } from "./shadow_root.ts";
import type { ProcessingInstruction } from "./processing_instruction.ts";

export class UnImplemented extends Error {}

export function isDocument(node: Node): node is Document {
  return node.nodeType === node.DOCUMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === node.DOCUMENT_FRAGMENT_NODE;
}

export function isDocumentType(node: Node): node is DocumentType {
  return node.nodeType === node.DOCUMENT_TYPE_NODE;
}

export function isElement(node: Node): node is Element {
  return node.nodeType === node.ELEMENT_NODE;
}

export function isCharacterData(node: Node): node is CharacterData {
  return $data in node;
}

export function isAttr(node: Node): node is Attr {
  return node.nodeType === node.ATTRIBUTE_NODE;
}

export function isText(node: Node): node is Text {
  return node.nodeType === node.TEXT_NODE;
}

export function isComment(node: Node): node is Comment {
  return node.nodeType === node.COMMENT_NODE;
}

export function isProcessingInstruction(
  node: Node,
): node is ProcessingInstruction {
  return node.nodeType === node.COMMENT_NODE;
}

/** Whether the {@linkcode node} is {@linkcode ShadowRoot} or not. */
export function isShadowRoot(node: Node): node is ShadowRoot {
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