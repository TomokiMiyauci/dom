import { ElementCSSInlineStyle } from "../element_css_inline_style.ts";
import { HTMLElement } from "../../html/dom/html_element.ts";
import { SVGElement } from "../../svg/elements/svg_element.ts";
import { includes } from "../../../utils.ts";

declare module "../../html/dom/html_element.ts" {
  interface HTMLElement extends ElementCSSInlineStyle {}
}

declare module "../../svg/elements/svg_element.ts" {
  interface SVGElement extends ElementCSSInlineStyle {}
}

includes(HTMLElement, ElementCSSInlineStyle);
includes(SVGElement, ElementCSSInlineStyle);
