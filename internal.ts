import { type DocumentTypeInternals } from "./dom/nodes/document_type.ts";
import { type AttrInternals } from "./dom/nodes/elements/attr.ts";
import { type ElementInternals } from "./dom/nodes/elements/element.ts";
import { type CharacterDataInternals } from "./dom/nodes/character_data.ts";
import { type DocumentFragmentInternals } from "./dom/nodes/document_fragment.ts";
import { type DocumentInternals } from "./dom/nodes/documents/document.ts";
import { type DOMImplementationInternals } from "./dom/nodes/documents/dom_implementation.ts";
import { type ProcessingInstructionInternals } from "./dom/nodes/processing_instruction.ts";
import { type NodeInternals } from "./dom/nodes/node.ts";

import { HTMLTemplateElementInternals } from "./html/elements/html_template_element.ts";

export interface InternalSlots {
  set(key: HTMLTemplateElement, value: HTMLTemplateElementInternals): void;
  set(key: Element, value: ElementInternals): void;
  set(key: Attr, value: AttrInternals): void;
  set(key: DocumentType, value: DocumentTypeInternals): void;
  set(key: ProcessingInstruction, value: ProcessingInstructionInternals): void;
  set(key: CharacterData, value: CharacterDataInternals): void;
  set(key: DocumentFragment, value: DocumentFragmentInternals): void;
  set(key: Document, value: DocumentInternals): void;
  set(key: DOMImplementation, value: DOMImplementationInternals): void;
  set(key: Node, value: NodeInternals): void;

  has(key: object): boolean;

  get(key: HTMLTemplateElement): HTMLTemplateElementInternals;
  get(key: Element): ElementInternals;
  get(key: Attr): AttrInternals;
  get(key: DocumentType): DocumentTypeInternals;
  get(key: ProcessingInstruction): ProcessingInstructionInternals;
  get(key: CharacterData): CharacterDataInternals;
  get(key: DocumentFragment): DocumentFragmentInternals;
  get(key: Document): DocumentInternals;
  get(key: DOMImplementation): DOMImplementationInternals;
  get(key: Node): NodeInternals;
}

export class InternalSlotsMap {
  #map = new WeakMap();
  set(key: object, value: object): void {
    this.#map.set(key, value);
  }

  has(key: object): boolean {
    return this.#map.has(key);
  }

  get(key: object): unknown {
    if (this.#map.has(key)) return this.#map.get(key);

    throw new Error(`internal slot does not exist. ${key}`);
  }
}

export const internalSlots = new InternalSlotsMap() as InternalSlots;

export const $ = internalSlots.get.bind(internalSlots);
