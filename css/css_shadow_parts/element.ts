import { type IElement } from "../../interface.d.ts";
import { type Constructor } from "../../deps.ts";

type IElement_CSSShadowParts = Pick<IElement, "part">;

export function Element_CSSShadowParts<T extends Constructor>(Ctor: T) {
  abstract class Element_CSSShadowParts extends Ctor
    implements IElement_CSSShadowParts {
    get part(): DOMTokenList {
      throw new Error("part");
    }
  }

  return Element_CSSShadowParts;
}

// deno-lint-ignore no-empty-interface
export interface Element_CSSShadowParts extends IElement_CSSShadowParts {}
