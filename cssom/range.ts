import { Constructor } from "../deps.ts";
import type { IRange } from "../interface.d.ts";

type IRange_CSSOM = Pick<IRange, "getClientRects" | "getBoundingClientRect">;

export function Range_CSSOM<T extends Constructor>(Ctor: T) {
  abstract class Range_CSSOM extends Ctor implements IRange_CSSOM {
    getClientRects(): DOMRectList {
      throw new Error("getClientRects");
    }

    getBoundingClientRect(): DOMRect {
      throw new Error("getBoundingClientRect");
    }
  }

  return Range_CSSOM;
}

// deno-lint-ignore no-empty-interface
export interface Range_CSSOM extends IRange_CSSOM {}
