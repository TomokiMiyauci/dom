import { ElementCSSInlineStyle_CSSTypedOM } from "../css/css_typed_om/element_css_inline_style.ts";
import { CSSStyleDeclaration } from "./css_style_declaration.ts";
import { type Element } from "../../nodes/element.ts";
import { PutForwards, SameObject } from "../webidl/extended_attribute.ts";

// @ElementCSSInlineStyle_CSSTypedOM
export class ElementCSSInlineStyle {
  @SameObject
  @PutForwards("cssText")
  get style(): CSSStyleDeclaration {
    // TODO
    return new CSSStyleDeclaration({ ownerNode: this });
  }
}

export interface ElementCSSInlineStyle
  extends Element, ElementCSSInlineStyle_CSSTypedOM {}
