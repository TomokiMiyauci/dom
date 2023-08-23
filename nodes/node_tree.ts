import {
  isAttr,
  isCharacterData,
  isDocumentType,
  isElement,
  isText,
} from "./utils.ts";
import { $data } from "./internal.ts";
import { type Attr } from "./attr.ts";
import { type Document } from "./document.ts";
import { type DocumentFragment } from "./document_fragment.ts";
import { type DocumentType } from "./document_type.ts";
import { type Element } from "./element.ts";
import { type Text } from "./text.ts";
import { type Node } from "./node.ts";
import { type CharacterData } from "./character_data.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-length
 */
export function nodeLength(
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

type Slottable = Element | Text;

/**
 * @see https://dom.spec.whatwg.org/#concept-slotable
 */
export function isSlottable(node: Node): node is Slottable {
  return isElement(node) || isText(node);
}

/**
 * @see https://dom.spec.whatwg.org/#assign-a-slot
 */
export function assignSlot(slottable: Slottable): void {
  // 1. Let slot be the result of finding a slot with slottable.
  const slot = findSlot(slottable);

  // 2. If slot is non-null, then run assign slottables for slot.
  if (slot) assignSlottables(slot);
}

/**
 * @see https://dom.spec.whatwg.org/#find-a-slot
 */
export function findSlot(slottable: Slottable, open?: boolean): null {
  throw new Error("findSlot");
}

/**
 * @see https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
 */
export function assignSlottablesForTree(root: Node): void {
  throw new Error("assignSlottablesForTree");
}

/**
 * @see https://dom.spec.whatwg.org/#assign-slotables
 */
export function assignSlottables(slot: HTMLSlotElement): void {
  throw new Error("assignSlottables");
}

/**
 * @see https://dom.spec.whatwg.org/#signal-a-slot-change
 */
export function signalSlotChange(slot: HTMLSlotElement) {
  throw new Error("signalSlotChange");
}
