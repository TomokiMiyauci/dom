import { type AttrInternals } from "./dom/nodes/elements/attr.ts";

export interface InternalSlots {
  set(key: Attr, value: AttrInternals): void;

  get(key: Attr): AttrInternals;
}

export class InternalSlotsMap {
  #map = new WeakMap();
  set(key: object, value: unknown): void {
    this.#map.set(key, value);
  }

  get(key: object): unknown {
    if (this.#map.has(key)) return this.#map.get(key);

    throw new Error(`internal slot does not exist. ${key}`);
  }
}

export const internalSlots = new InternalSlotsMap() as InternalSlots;

export const $ = internalSlots.get.bind(internalSlots);
