import {
  isAttr,
  isCharacterData,
  isDocument,
  isDocumentType,
  isElement,
  isShadowRoot,
  isText,
} from "../utils.ts";
import { $, tree } from "../../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-length
 */
export function nodeLength(
  node:
    | Node
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
  if (isCharacterData(node)) return $(node).data.length;

  // 3. Return the number of node’s children.
  return tree.children(node).size;
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
export function signalSlotChange(slot: Element): void {
  // 1. Append slot to slot’s relevant agent’s signal slots.
  // TODO
  // 2. Queue a mutation observer microtask.
}

/**
 * @see https://dom.spec.whatwg.org/#connected
 */
export function isConnected(node: Node): boolean {
  // if its shadow-including root is a document.
  const root = getShadowIncludingRoot(node);

  return isDocument(root);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
 */
export function getShadowIncludingRoot(node: Node): Node {
  // object is its root’s host’s shadow-including root, if the object’s root is a shadow root; otherwise its root.
  const root = tree.root(node);

  if (isShadowRoot(root)) {
    const host = $(root).host;
    return getShadowIncludingRoot(host);
  }

  return root;
}

/** Return document element of document.
 * @see https://dom.spec.whatwg.org/#document-element
 */
export function getDocumentElement<T extends Node>(
  node: T,
): globalThis.Element | null {
  for (const child of tree.children(node)) if (isElement(child)) return child;

  return null;
}
