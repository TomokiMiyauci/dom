import { type Constructor } from "../deps.ts";
import type { IInnerHTML } from "../interface.d.ts";

export function InnerHTML<T extends Constructor>(Ctor: T) {
  abstract class InnerHTML extends Ctor implements IInnerHTML {
    get innerHTML(): string {
      throw new Error();
    }

    set innerHTML(value: string) {
      throw new Error();
    }
  }

  return InnerHTML;
}

// deno-lint-ignore no-empty-interface
export interface InnerHTML extends IInnerHTML {}
