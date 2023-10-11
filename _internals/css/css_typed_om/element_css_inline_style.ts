import { Constructor } from "../../../deps.ts";
import type { IElementCSSInlineStyle } from "../../../interface.d.ts";

type IElementCSSInlineStyle_CSSTypedOM = Pick<
  IElementCSSInlineStyle,
  "attributeStyleMap"
>;

export function ElementCSSInlineStyle_CSSTypedOM<T extends Constructor>(
  Ctor: T,
) {
  abstract class ElementCSSInlineStyle_CSSTypedOM extends Ctor
    implements IElementCSSInlineStyle_CSSTypedOM {
    get attributeStyleMap(): StylePropertyMap {
      throw new Error("attributeStyleMap");
    }
  }

  return ElementCSSInlineStyle_CSSTypedOM;
}

// deno-lint-ignore no-empty-interface
export interface ElementCSSInlineStyle_CSSTypedOM
  extends IElementCSSInlineStyle_CSSTypedOM {}
