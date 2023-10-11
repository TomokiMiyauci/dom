import type { IElement } from "../../interface.d.ts";

type IElement_CSSTypedOM = Pick<IElement, "computedStyleMap">;

export class Element implements IElement_CSSTypedOM {
  computedStyleMap(): StylePropertyMapReadOnly {
    throw new Error("computedStyleMap");
  }
}
