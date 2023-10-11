import {
  isAttr,
  isCharacterData,
  isDocument,
  isDocumentType,
  isElement,
  isText,
} from "../utils.ts";
import { $, tree } from "../../internal.ts";
import { queueMutationObserverMicrotask } from "../mutation_observers/queue.ts";
import { iter } from "../../deps.ts";
import { List } from "../../_internals/infra/data_structures/list.ts";
import { isShadowRootNode } from "../utils/shadow_root.ts";

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
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#find-a-slot)
 */
export function findSlot(
  slottable: Slottable,
  open = false,
): HTMLSlotElement | null {
  const parent = tree.parent(slottable);
  // 1. If slottable’s parent is null, then return null.
  if (!parent) return null;

  // 2. Let shadow be slottable’s parent’s shadow root.
  const shadow =
    ($(parent) as any as { shadowRoot: ShadowRoot | null }).shadowRoot;

  // 3. If shadow is null, then return null.
  if (!shadow) return null;

  // 4. If the open flag is set and shadow’s mode is not "open", then return null.
  if (open && $(shadow).mode !== "open") return null;

  const shadowDescendants = iter(tree.descendants(shadow));
  // 5. If shadow’s slot assignment is "manual", then return the slot in shadow’s descendants whose manually assigned nodes contains slottable, if any; otherwise null.
  if ($(shadow).slotAssignment === "manual") {
    return shadowDescendants.filter(isElement).filter(isSlot).find(
      slotManuallyAssignedNodesContainsSlottable,
    ) ?? null;
  }

  // 6. Return the first slot in tree order in shadow’s descendants whose name is slottable’s name, if any; otherwise null.
  return shadowDescendants.filter(isElement).filter(isSlot).find(
    nameIsSlottableName,
  ) ?? null;

  function slotManuallyAssignedNodesContainsSlottable(
    slot: HTMLSlotElement,
  ): boolean {
    return $(slot).manuallyAssignedNodes.contains(slottable);
  }

  function nameIsSlottableName(element: Element): boolean {
    return $(element).name === $(slottable).name;
  }
}

/**
 * @see https://dom.spec.whatwg.org/#find-a-slot
 */
export function findSlottables(slot: HTMLSlotElement): List<Slottable> {
  // 1. Let result be an empty list.
  const result = new List<Slottable>();

  // 2. Let root be slot’s root.
  const root = tree.root(slot);

  // 3. If root is not a shadow root, then return result.
  if (!isShadowRootNode(root)) return result;

  // 4. Let host be root’s host.
  const { host } = $(root);

  // 5. If root’s slot assignment is "manual", then:
  if ($(root).slotAssignment === "manual") {
    // 1. Let result be « ». // This is not necessary

    // 2. For each slottable slottable of slot’s manually assigned nodes,
    for (const slottable of $(slot).manuallyAssignedNodes) {
      // if slottable’s parent is host, append slottable to result.
      if (tree.parent(slottable) === host) result.append(slottable);
    }
    // 6.  Otherwise,
  } else {
    const hostChildren = tree.children(host);
    // for each slottable child slottable of host, in tree order:
    for (const slottable of iter(hostChildren).filter(isSlottable)) {
      // 1. Let foundSlot be the result of finding a slot given slottable.
      const foundSlot = findSlot(slottable);

      // 2. If foundSlot is slot, then append slottable to result.
      if (foundSlot) result.append(foundSlot);
    }
  }

  // 7. Return result.
  return result;
}

/**
 * @see https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
 */
export function assignSlottablesForTree(root: Node): void {
  const inclusiveDescendants = tree.inclusiveDescendants(root);

  // run assign slottables for each slot slot in root’s inclusive descendants, in tree order.
  for (
    const slot of iter(inclusiveDescendants).filter(isElement).filter(isSlot)
  ) assignSlottables(slot);
}

/**
 * @see https://dom.spec.whatwg.org/#assign-slotables
 */
export function assignSlottables(slot: HTMLSlotElement): void {
  // 1. Let slottables be the result of finding slottables for slot.
  const slottables = findSlottables(slot);

  // 2. If slottables and slot’s assigned nodes are not identical, then run signal a slot change for slot.
  if (slottables !== $(slot).assignedNodes) signalSlotChange(slot);

  // 3. Set slot’s assigned nodes to slottables.
  $(slot).assignedNodes = slottables;

  // 4. For each slottable in slottables, set slottable’s assigned slot to slot.
  for (const slottable of slottables) $(slottable).assignedSlot = slot;
}

/**
 * @see https://dom.spec.whatwg.org/#signal-a-slot-change
 */
export function signalSlotChange(slot: Element): void {
  // TODO
  // 1. Append slot to slot’s relevant agent’s signal slots.
  // 2. Queue a mutation observer microtask.
  queueMutationObserverMicrotask();
}

/**
 * @see https://dom.spec.whatwg.org/#connected
 */
export function isConnected(node: Node): node is Element {
  const root = tree.shadowIncludingRoot(node);
  // if its shadow-including root is a document.
  return isDocument(root);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-slot
 */
export function isSlot(element: Element): element is HTMLSlotElement {
  return $(element).name === "slot";
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
