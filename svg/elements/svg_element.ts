import type { ISVGElement } from "../../interface.d.ts";
import { Element } from "../../dom/nodes/element.ts";
import { GlobalEventHandlers } from "../../html/global_event_handlers.ts";
import { HTMLOrSVGElement } from "../../html/dom/html_or_svg_element.ts";
import { ElementCSSInlineStyle } from "../../cssom/element_css_inline_style.ts";

@GlobalEventHandlers
@HTMLOrSVGElement
@ElementCSSInlineStyle
export class SVGElement extends Element implements ISVGElement {
  get ownerSVGElement(): SVGSVGElement | null {
    throw new Error("ownerSVGElement");
  }

  get viewportElement(): SVGElement | null {
    throw new Error("viewportElement");
  }
}

export interface SVGElement
  extends GlobalEventHandlers, HTMLOrSVGElement, ElementCSSInlineStyle {
  addEventListener<K extends keyof SVGElementEventMap>(
    type: K,
    listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof SVGElementEventMap>(
    type: K,
    listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
