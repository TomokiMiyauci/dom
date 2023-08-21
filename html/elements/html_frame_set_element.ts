import type { IHTMLFrameSetElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { WindowEventHandlers } from "../window_event_handlers.ts";

@WindowEventHandlers
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

// deno-lint-ignore no-empty-interface
export interface HTMLFrameSetElement extends WindowEventHandlers {}
