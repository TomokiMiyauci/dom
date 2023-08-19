// deno-lint-ignore-file no-explicit-any
import { Element } from "../../nodes/element.ts";
import { GlobalEventHandlers } from "../global_event_handlers.ts";
import { ElementContentEditable } from "../element_content_editable.ts";
import { HTMLOrSVGElement } from "./html_or_svg_element.ts";
import { HTMLElement_CSSOMView } from "../../cssom/html_element.ts";
import { ElementCSSInlineStyle } from "../../cssom/element_css_inline_style.ts";
import type { IHTMLElement } from "../../interface.d.ts";

@GlobalEventHandlers
@ElementContentEditable
@HTMLOrSVGElement
@ElementCSSInlineStyle
@HTMLElement_CSSOMView
export class HTMLElement extends Element implements IHTMLElement {
  get title(): string {
    throw new Error("title#getter");
  }

  set title(value: string) {
    throw new Error("title#setter");
  }

  get lang(): string {
    throw new Error("lang#getter");
  }

  set lang(value: string) {
    throw new Error("lang#setter");
  }

  get translate(): boolean {
    throw new Error("translate#getter");
  }

  set translate(value: boolean) {
    throw new Error("translate#setter");
  }

  get dir(): string {
    throw new Error("dir#getter");
  }

  set dir(value: string) {
    throw new Error("dir#setter");
  }

  get hidden(): boolean {
    throw new Error("hidden#getter");
  }

  set hidden(value: boolean) {
    throw new Error("hidden#setter");
  }

  get inert(): boolean {
    throw new Error("inert#getter");
  }

  set inert(value: boolean) {
    throw new Error("inert#setter");
  }

  click(): void {
    throw new Error("click");
  }

  get accessKey(): string {
    throw new Error("accessKey#getter");
  }

  set accessKey(value: string) {
    throw new Error("accessKey#setter");
  }

  get accessKeyLabel(): string {
    throw new Error("accessKeyLabel#getter");
  }

  get draggable(): boolean {
    throw new Error("draggable#getter");
  }

  set draggable(value: boolean) {
    throw new Error("draggable#setter");
  }

  get spellcheck(): boolean {
    throw new Error("spellcheck#getter");
  }

  set spellcheck(value: boolean) {
    throw new Error("spellcheck#setter");
  }

  get autocapitalize(): string {
    throw new Error("autocapitalize#getter");
  }

  set autocapitalize(value: string) {
    throw new Error("autocapitalize#setter");
  }

  get innerText(): string {
    throw new Error("innerText#getter");
  }

  set innerText(value: string) {
    throw new Error("innerText#setter");
  }

  get outerText(): string {
    throw new Error("outerText#getter");
  }

  set outerText(value: string) {
    throw new Error("outerText#setter");
  }

  attachInternals(): ElementInternals {
    throw new Error("attachInternals");
  }
}

export interface HTMLElement
  extends
    GlobalEventHandlers,
    ElementContentEditable,
    HTMLOrSVGElement,
    ElementCSSInlineStyle,
    HTMLElement_CSSOMView {
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
