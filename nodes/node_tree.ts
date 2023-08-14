import { isAttr, isCharacterData, isDocumentType } from "./utils.ts";
import { $data } from "./internal.ts";
import { type Attr } from "./attr.ts";
import { type Document } from "./document.ts";
import { type DocumentFragment } from "./document_fragment.ts";
import { type DocumentType } from "./document_type.ts";
import { type Element } from "./element.ts";
import { type CharacterData } from "./character_data.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-length
 */
export function len(
  node:
    | Document
    | DocumentType
    | DocumentFragment
    | Element
    | CharacterData
    | Attr,
): number {
  // 1. If node is a DocumentType or Attr node, then return 0.
  if (isDocumentType(node) || isAttr(node)) return 0;

  // 2. If node is a CharacterData node, then return node’s data’s length.
  if (isCharacterData(node)) return node[$data].length;

  // 3. Return the number of node’s children.
  return node._children.size;
}
