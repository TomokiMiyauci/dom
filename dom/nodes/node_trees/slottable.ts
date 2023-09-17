import type { ISlottable } from "../../../interface.d.ts";
import { type Constructor } from "../../../deps.ts";
import { UnImplemented } from "../utils.ts";

export function Slottable<T extends Constructor>(Ctor: T) {
  abstract class Slottable extends Ctor implements ISlottable {
    get assignedSlot(): HTMLSlotElement | null {
      throw new UnImplemented("assignedSlot");
    }

    set assignedSlot(value: HTMLSlotElement | null) {
      throw new UnImplemented("assignedSlot");
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
  assignedSlot: Element | Text | null = null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#slottable-manual-slot-assignment)
   */
  manualSlotAssignment: Element | null = null;
}
