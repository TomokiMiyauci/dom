import { type Constructor } from "../deps.ts";
import type { IInnerHTML } from "../interface.d.ts";

export function InnerHTML<T extends Constructor>(Ctor: T) {
  return class extends Ctor implements IInnerHTML {
    get innerHTML(): string {
      throw new Error();
    }

    set innerHTML(value: string) {
      throw new Error();
    }
  };
}

// deno-lint-ignore no-empty-interface
export interface InnerHTML extends IInnerHTML {}
