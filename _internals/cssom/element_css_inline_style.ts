import { Constructor } from "../../deps.ts";
import type { IElementCSSInlineStyle } from "../../interface.d.ts";
import { ElementCSSInlineStyle_CSSTypedOM } from "../css/css_typed_om/element_css_inline_style.ts";
import { CSSStyleDeclaration } from "./css_style_declaration.ts";
import { type Element } from "../../nodes/elements/element.ts";
import { PutForwards, SameObject } from "../webidl/extended_attribute.ts";

export function ElementCSSInlineStyle<T extends Constructor<Element>>(Ctor: T) {
  @ElementCSSInlineStyle_CSSTypedOM
  abstract class HTMLElement_CSSOMView extends Ctor
    implements IElementCSSInlineStyle {
    @SameObject
    @PutForwards("cssText")
    get style(): CSSStyleDeclaration {
      // TODO
      return new CSSStyleDeclaration({ ownerNode: this });
    }
  }

  // deno-lint-ignore no-empty-interface
  interface HTMLElement_CSSOMView extends ElementCSSInlineStyle_CSSTypedOM {}

  return HTMLElement_CSSOMView;
}

// deno-lint-ignore no-empty-interface
export interface ElementCSSInlineStyle extends IElementCSSInlineStyle {}
