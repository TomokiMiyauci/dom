import { NodeType } from "../node.ts";
import { $, internalSlots } from "../../internal.ts";
import type {
  $CharacterData,
  $DocumentFragment,
  $Element,
  $ShadowRoot,
  CharacterDataInternals,
} from "../../i.ts";
import * as $$ from "../../symbol.ts";

export interface NodeLike {
  nodeType: unknown;
}

export function isNodeLike(object: object): object is NodeLike {
  return "nodeType" in object;
}

export function isDocument(node: NodeLike): node is Document {
  return node.nodeType === NodeType.DOCUMENT_NODE;
}

export function isDocumentFragment(node: NodeLike): node is $DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}

export function isDocumentType(node: NodeLike): node is DocumentType {
  return node.nodeType === NodeType.DOCUMENT_TYPE_NODE;
}

export function isElement(node: NodeLike): node is $Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function isCharacterData(node: NodeLike): node is CharacterData {
  return node.nodeType === NodeType.TEXT_NODE ||
    node.nodeType === NodeType.PROCESSING_INSTRUCTION_NODE ||
    node.nodeType === NodeType.CDATA_SECTION_NODE ||
    node.nodeType === NodeType.COMMENT_NODE;
}

export function is$CharacterData(node: NodeLike): node is $CharacterData {
  return isCharacterData(node);
}

export function isText(node: NodeLike): node is Text {
  return node.nodeType === NodeType.TEXT_NODE;
}

export function isMyText(node: Node): node is Text & CharacterDataInternals {
  return isText(node);
}

/** Whether the {@linkcode node} is {@linkcode ShadowRoot} or not. */
export function isShadowRoot(node: NodeLike): node is $ShadowRoot {
  return isDocumentFragment(node) && !!node[$$.host];
}

export function isProcessingInstruction(
  node: Node,
): node is ProcessingInstruction {
  return node.nodeType === node.COMMENT_NODE;
}

export function isComment(node: Node): node is Comment {
  return node.nodeType === node.COMMENT_NODE;
}

export type ShadowHost = $Element & {
  _shadowRoot: ShadowRoot;
};

/**
 * @see https://dom.spec.whatwg.org/#element-shadow-host
 */
export function isShadowHost(element: $Element): element is ShadowHost {
  // shadow root is non-null.
  return !!element[$$.shadowRoot];
}
