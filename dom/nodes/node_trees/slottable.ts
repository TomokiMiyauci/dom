import type { ISlottable } from "../../../interface.d.ts";
import { type Constructor } from "../../../deps.ts";
import { findSlot } from "./node_tree.ts";

export function Slottable<T extends Constructor<Element>>(
  Ctor: T,
): T & Constructor<Slottable>;
export function Slottable<T extends Constructor<Text>>(
  Ctor: T,
): T & Constructor<Slottable>;
export function Slottable<T extends Constructor<Element & Text>>(
  Ctor: T,
): T & Constructor<Slottable> {
  abstract class Slottable extends Ctor implements ISlottable {
    /**
     * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-slottable-assignedslot)
     */
    override get assignedSlot(): HTMLSlotElement | null {
      // return the result of find a slot given this and with the open flag set.
      return findSlot(this, true) as HTMLSlotElement | null;
    }
  }

  return Slottable;
}

// deno-lint-ignore no-empty-interface
export interface Slottable extends ISlottable {}

export class SlottableInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#slotable-name)
   */
  name = "";

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#slotable-assigned-slot)
   */
  assignedSlot: HTMLSlotElement | null = null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#slottable-manual-slot-assignment)
   */
  manualSlotAssignment: Element | null = null;
}
