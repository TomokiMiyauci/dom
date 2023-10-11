import { type DocumentTypeInternals } from "./nodes/document_type.ts";
import { type AttrInternals } from "./nodes/elements/attr.ts";
import { type ElementInternals } from "./nodes/elements/element.ts";
import { type CharacterDataInternals } from "./nodes/character_data.ts";
import { type DocumentFragmentInternals } from "./nodes/document_fragment.ts";
import { type DocumentInternals } from "./nodes/documents/document.ts";
import { type DOMImplementationInternals } from "./nodes/documents/dom_implementation.ts";
import { type ProcessingInstructionInternals } from "./nodes/processing_instruction.ts";
import { type NodeInternals } from "./nodes/node.ts";
import { type EventInternals } from "./events/event.ts";
import { type EventTargetInternals } from "./events/event_target.ts";
import { type ShadowRootInternals } from "./nodes/shadow_root.ts";
import { type SlottableInternals } from "./nodes/node_trees/slottable.ts";
import { type MutationObserverInternals } from "./nodes/mutation_observers/mutation_observer.ts";
import { type AbortSignalInternals } from "./aborts/abort_signal.ts";

import { SelectionInternals } from "./_internals/selection/selection.ts";

import { HTMLTemplateElementInternals } from "./_internals/html/elements/html_template_element.ts";
import { Tree } from "./infra/tree.ts";
import { ShadowTree } from "./nodes/shadow_root_utils.ts";
import { AbstractRangeInternals } from "./ranges/abstract_range.ts";
import { NodeIteratorInternals } from "./traversals/node_iterator.ts";
import { TreeWalkerInternals } from "./traversals/tree_walker.ts";
import { OrderedSet } from "./_internals/infra/data_structures/set.ts";
import { List } from "./_internals/infra/data_structures/list.ts";
import { TextTree } from "./nodes/text_utils.ts";
import { emplace, UnionToIntersection } from "./deps.ts";
import { extend } from "./utils.ts";
import type { ResponseInternals } from "./_internals/fetch/response.ts";
import type { RequestInternals } from "./_internals/fetch/request.ts";
import {
  Agent,
  RealmRecord,
} from "./ecma/executable_coce_and_execution_context.ts";
import { EventLoop } from "./_internals/html/web_application_apis/scripting.ts";
import { LocationInternals } from "./_internals/html/loading_web_pages/location.ts";
import { WindowInternals } from "./_internals/html/loading_web_pages/window.ts";
import { HTMLScriptElementInternals } from "./_internals/html/elements/scripting/html_script_element.ts";
import type { HTMLInputElementInternals } from "./_internals/html/elements/html_input_element.ts";
import type { FormAssociatedElement } from "./_internals/html/elements/forms/attributes_common_to_form_control.ts";

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
  [Response, ResponseInternals],
  [Request, RequestInternals],
  [object, { realm: RealmRecord }],
  [Agent, EventLoop],
  [Window, WindowInternals],
  [Location, LocationInternals],
  [HTMLScriptElement, HTMLScriptElementInternals],
  [AbortSignal, AbortSignalInternals],
  [HTMLInputElement, HTMLInputElementInternals],
  [FormAssociatedElement, { formOwner: HTMLFormElement | null }],
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
