import type { ISlottable } from "./../interface.d.ts";
import { findSlot } from "./node_tree.ts";

export class Slottable implements ISlottable {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-slottable-assignedslot)
   */
  get assignedSlot(): HTMLSlotElement | null {
    // return the result of find a slot given this and with the open flag set.
    return findSlot(this, true) as HTMLSlotElement | null;
  }
}

export interface Slottable extends Element {}

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
