import type { ISVGElement } from "../../interface.d.ts";
import { Element } from "../../../nodes/element.ts";
import { ElementCSSInlineStyle } from "../../cssom/element_css_inline_style.ts";

export class SVGElement extends Element implements ISVGElement {
  get ownerSVGElement(): SVGSVGElement | null {
    throw new Error("ownerSVGElement");
  }

  get viewportElement(): SVGElement | null {
    throw new Error("viewportElement");
  }
}

export interface SVGElement extends ElementCSSInlineStyle {
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
