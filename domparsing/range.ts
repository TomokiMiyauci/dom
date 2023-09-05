import { Constructor } from "../deps.ts";
import type { IRange } from "../interface.d.ts";

type IRange_DOMParsing = Pick<IRange, "createContextualFragment">;

export function Range_DOMParsing<T extends Constructor>(Ctor: T) {
  abstract class Range_DOMParsing extends Ctor implements IRange_DOMParsing {
    createContextualFragment(fragment: string): DocumentFragment {
      throw new Error("createContextualFragment");
    }
  }

  return Range_DOMParsing;
}

// deno-lint-ignore no-empty-interface
export interface Range_DOMParsing extends IRange_DOMParsing {}
