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

    protected _assignedSlot: Element | null = null;
  }

  return Slottable;
}

// deno-lint-ignore no-empty-interface
export interface Slottable extends ISlottable {}
