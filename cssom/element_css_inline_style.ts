import { Constructor } from "../deps.ts";
import type { IElementCSSInlineStyle } from "../interface.d.ts";
import { ElementCSSInlineStyle_CSSTypedOM } from "../css/css_typed_om/element_css_inline_style.ts";

export function ElementCSSInlineStyle<T extends Constructor>(Ctor: T) {
  @ElementCSSInlineStyle_CSSTypedOM
  abstract class HTMLElement_CSSOMView extends Ctor
    implements IElementCSSInlineStyle {
    get style(): CSSStyleDeclaration {
      throw new Error("style");
    }
  }

  // deno-lint-ignore no-empty-interface
  interface HTMLElement_CSSOMView extends ElementCSSInlineStyle_CSSTypedOM {}

  return HTMLElement_CSSOMView;
}

// deno-lint-ignore no-empty-interface
export interface ElementCSSInlineStyle extends IElementCSSInlineStyle {}
