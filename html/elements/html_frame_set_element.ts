import type { IHTMLFrameSetElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { WindowEventHandlers } from "../window_event_handlers.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@WindowEventHandlers
@Exposed("Window", "HTMLFrameSetElement")
export class HTMLFrameSetElement extends HTMLElement
  implements IHTMLFrameSetElement {
  get cols(): string {
    throw new Error("cols#getter");
  }
  set cols(value: string) {
    throw new Error("cols#setter");
  }
  get rows(): string {
    throw new Error("rows#getter");
  }
  set rows(value: string) {
    throw new Error("rows#setter");
  }
}

export interface HTMLFrameSetElement extends WindowEventHandlers {
  addEventListener<K extends keyof HTMLFrameSetElementEventMap>(
    type: K,
    listener: (
      this: HTMLFrameSetElement,
      ev: HTMLFrameSetElementEventMap[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLFrameSetElementEventMap>(
    type: K,
    listener: (
      this: HTMLFrameSetElement,
      ev: HTMLFrameSetElementEventMap[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
