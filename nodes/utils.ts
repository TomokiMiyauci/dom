import { $data } from "./internal.ts";
import { type Node } from "./node.ts";
import { type Text } from "./text.ts";
import { type Document } from "./document.ts";
import { type DocumentFragment } from "./document_fragment.ts";
import { type DocumentType } from "./document_type.ts";
import { type Element } from "./element.ts";
import { type Attr } from "./attr.ts";
import { type CharacterData } from "./character_data.ts";

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
