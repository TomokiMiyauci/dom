import { type AttrInternals } from "./dom/nodes/elements/attr.ts";
import { type ElementInternals } from "./dom/nodes/elements/element.ts";

export interface InternalSlots {
  set(key: Element, value: ElementInternals): void;
  set(key: Attr, value: AttrInternals): void;

  has(key: object): boolean;

  get(key: Element): ElementInternals;
  get(key: Attr): AttrInternals;
}

export class InternalSlotsMap {
  #map = new WeakMap();
  set(key: object, value: unknown): void {
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
