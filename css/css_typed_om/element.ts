import { Constructor } from "../../deps.ts";
import type { IElement } from "../../interface.d.ts";

type IElement_CSSTypedOM = Pick<IElement, "computedStyleMap">;

export function Element_CSSTypedOM<T extends Constructor>(Ctor: T) {
  abstract class Element_CSSTypedOM extends Ctor
    implements IElement_CSSTypedOM {
    computedStyleMap(): StylePropertyMapReadOnly {
      throw new Error("computedStyleMap");
    }
  }

  return Element_CSSTypedOM;
}

// deno-lint-ignore no-empty-interface
export interface Element_CSSTypedOM extends IElement_CSSTypedOM {}
