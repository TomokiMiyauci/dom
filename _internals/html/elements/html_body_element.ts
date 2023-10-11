import { type Constructor } from "../../../deps.ts";
import type { IHTMLBodyElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { WindowEventHandlers } from "../window_event_handlers.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@WindowEventHandlers
@HTMLBodyElement_Obsolete
@Exposed("Window", "HTMLBodyElement")
export class HTMLBodyElement extends HTMLElement implements IHTMLBodyElement {}

export interface HTMLBodyElement
  extends WindowEventHandlers, HTMLBodyElement_Obsolete {
  addEventListener<K extends keyof HTMLBodyElementEventMap>(
    type: K,
    listener: (this: HTMLBodyElement, ev: HTMLBodyElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLBodyElementEventMap>(
    type: K,
    listener: (this: HTMLBodyElement, ev: HTMLBodyElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

type IHTMLBodyElement_Obsolete = Pick<
  IHTMLBodyElement,
  "text" | "link" | "vLink" | "aLink" | "bgColor" | "background"
>;

export function HTMLBodyElement_Obsolete<T extends Constructor>(Ctor: T) {
  abstract class HTMLBodyElement_Obsolete extends Ctor
    implements IHTMLBodyElement_Obsolete {
    get text(): string {
      throw new Error("text#getter");
    }

    set text(value: string) {
      throw new Error("text#setter");
    }

    get link(): string {
      throw new Error("link#getter");
    }

    set link(value: string) {
      throw new Error("link#setter");
    }

    get vLink(): string {
      throw new Error("vLink#getter");
    }

    set vLink(value: string) {
      throw new Error("vLink#setter");
    }

    get aLink(): string {
      throw new Error("aLink#getter");
    }

    set aLink(value: string) {
      throw new Error("aLink#setter");
    }

    get bgColor(): string {
      throw new Error("bgColor#getter");
    }

    set bgColor(value: string) {
      throw new Error("bgColor#setter");
    }

    get background(): string {
      throw new Error("background#getter");
    }

    set background(value: string) {
      throw new Error("background#setter");
    }
  }

  return HTMLBodyElement_Obsolete;
}

// deno-lint-ignore no-empty-interface
export interface HTMLBodyElement_Obsolete extends IHTMLBodyElement_Obsolete {}
