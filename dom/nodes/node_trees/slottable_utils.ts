import { $ } from "../../../internal.ts";

/**
 * @see [HTML Living Standard](https://dom.spec.whatwg.org/#slotable-assigned)
 */
export function isAssigned(slottable: Slottable): boolean {
  return !!$(slottable).assignedSlot;
}
