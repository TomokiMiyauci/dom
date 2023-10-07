import { GlobalEventHandlers } from "../global_event_handlers.ts";
import type { IGlobalEventHandlers } from "../../interface.d.ts";
import { Document } from "../../dom/nodes/documents/document.ts";
import { Window } from "../loading_web_pages/window.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { SVGElement } from "../../svg/elements/svg_element.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/documents/document.ts" {
  interface Document extends IGlobalEventHandlers {}
}

declare module "../loading_web_pages/window.ts" {
  interface Window extends IGlobalEventHandlers {}
}

declare module "../dom/html_element.ts" {
  interface HTMLElement extends IGlobalEventHandlers {}
}

declare module "../../svg/elements/svg_element.ts" {
  interface SVGElement extends IGlobalEventHandlers {}
}

includes(Document, GlobalEventHandlers);
includes(HTMLElement, GlobalEventHandlers);
includes(Window, GlobalEventHandlers);
includes(SVGElement, GlobalEventHandlers);
