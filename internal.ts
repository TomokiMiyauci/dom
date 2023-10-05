import { type DocumentTypeInternals } from "./dom/nodes/document_type.ts";
import { type AttrInternals } from "./dom/nodes/elements/attr.ts";
import { type ElementInternals } from "./dom/nodes/elements/element.ts";
import { type CharacterDataInternals } from "./dom/nodes/character_data.ts";
import { type DocumentFragmentInternals } from "./dom/nodes/document_fragment.ts";
import { type DocumentInternals } from "./dom/nodes/documents/document.ts";
import { type DOMImplementationInternals } from "./dom/nodes/documents/dom_implementation.ts";
import { type ProcessingInstructionInternals } from "./dom/nodes/processing_instruction.ts";
import { type NodeInternals } from "./dom/nodes/node.ts";
import { type EventInternals } from "./dom/events/event.ts";
import { type EventTargetInternals } from "./dom/events/event_target.ts";
import { type ShadowRootInternals } from "./dom/nodes/shadow_root.ts";
import { type SlottableInternals } from "./dom/nodes/node_trees/slottable.ts";
import { type MutationObserverInternals } from "./dom/nodes/mutation_observers/mutation_observer.ts";

import { SelectionInternals } from "./selection/selection.ts";

import { HTMLTemplateElementInternals } from "./html/elements/html_template_element.ts";
import { Tree } from "./dom/infra/tree.ts";
import { ShadowTree } from "./dom/nodes/shadow_root_utils.ts";
import { AbstractRangeInternals } from "./dom/ranges/abstract_range.ts";
import { NodeIteratorInternals } from "./dom/traversals/node_iterator.ts";
import { TreeWalkerInternals } from "./dom/traversals/tree_walker.ts";
import { OrderedSet } from "./infra/data_structures/set.ts";
import { List } from "./infra/data_structures/list.ts";
import { TextTree } from "./dom/nodes/text_utils.ts";
import { emplace, UnionToIntersection } from "./deps.ts";
import { extend } from "./utils.ts";

type InternalSlotEntries = [
  [Event, EventInternals],
  [EventTarget, EventTargetInternals],
  [Node, NodeInternals],
  [Attr, AttrInternals],
  [DocumentType, DocumentTypeInternals],
  [DocumentFragment, DocumentFragmentInternals],
  [Element, ElementInternals],
  [CharacterData, CharacterDataInternals],
  [Document, DocumentInternals],
  [DOMImplementation, DOMImplementationInternals],
  [AbstractRange, AbstractRangeInternals],
  [ShadowRoot, ShadowRootInternals],
  [NodeIterator, NodeIteratorInternals],
  [TreeWalker, TreeWalkerInternals],
  [ProcessingInstruction, ProcessingInstructionInternals],
  [Selection, SelectionInternals],
  [MutationObserver, MutationObserverInternals],
  [Slottable, SlottableInternals],
  [HTMLTemplateElement, HTMLTemplateElementInternals],
  [HTMLSlotElement, {
    manuallyAssignedNodes: OrderedSet<Element | Text>;
    assignedNodes: List<Element | Text>;
  }],
];

export interface InternalSlots<T extends [unknown, unknown]> {
  get<U extends T[0]>(
    key: U,
  ): UnionToIntersection<T extends any ? U extends T[0] ? T[1] : never : never>;

  has(key: object): boolean;

  extends<U extends T[0]>(
    key: U,
    value: T extends any ? U extends T[0] ? T[1] : never : never,
  ): void;
}

export class InternalSlotsMap {
  #map = new WeakMap();
  extends(key: object, value: Record<PropertyKey, unknown>): void {
    emplace(this.#map, key, {
      insert: () => {
        return value;
      },
      update: (existing) => {
        return extend(existing, value, { prototype: true });
      },
    });
  }

  has(key: object): boolean {
    return this.#map.has(key);
  }

  get(key: object): unknown {
    if (this.#map.has(key)) return this.#map.get(key);

    throw new Error(`internal slot does not exist. ${key}`);
  }
}
export const internalSlots = new InternalSlotsMap() as any as InternalSlots<
  InternalSlotEntries[number]
>;

export const $ = internalSlots.get.bind(internalSlots);

const ExtendedTree = TextTree(ShadowTree(Tree));

export const tree = new ExtendedTree<Node, ParentNode, ChildNode>();
