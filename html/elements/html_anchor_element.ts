import type { IHTMLAnchorElement } from "../../interface.d.ts";
import { HTMLHyperlinkElementUtils } from "../html_hyperlink_element_utils.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../dom/sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";

@HTMLHyperlinkElementUtils
export class HTMLAnchorElement extends HTMLElement
  implements IHTMLAnchorElement {
  get charset(): string {
    throw new Error("text#getter");
  }

  set charset(value: string) {
    throw new Error("text#setter");
  }

  get coords(): string {
    throw new Error("coords#getter");
  }

  set coords(value: string) {
    throw new Error("coords#setter");
  }

  get download(): string {
    throw new Error("download#getter");
  }

  set download(value: string) {
    throw new Error("download#setter");
  }

  get hreflang(): string {
    throw new Error("hreflang#getter");
  }

  set hreflang(value: string) {
    throw new Error("hreflang#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }

  set name(value: string) {
    throw new Error("name#setter");
  }

  get ping(): string {
    throw new Error("ping#getter");
  }

  set ping(value: string) {
    throw new Error("ping#setter");
  }

  get referrerPolicy(): string {
    throw new Error("referrerPolicy#getter");
  }

  set referrerPolicy(value: string) {
    throw new Error("referrerPolicy#setter");
  }

  get rel(): string {
    throw new Error("rel#getter");
  }

  set rel(value: string) {
    throw new Error("rel#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/text-level-semantics.html#dom-a-rellist
   */
  @SameObject
  @PutForwards("value")
  get relList(): DOMTokenList {
    // reflect the rel content attribute.
    return reflect(this, DOMTokenList, "rel");
  }

  get rev(): string {
    throw new Error("rev#getter");
  }

  set rev(value: string) {
    throw new Error("rev#setter");
  }

  get shape(): string {
    throw new Error("shape#getter");
  }

  set shape(value: string) {
    throw new Error("shape#setter");
  }

  get target(): string {
    throw new Error("target#getter");
  }

  set target(value: string) {
    throw new Error("target#setter");
  }

  get text(): string {
    throw new Error("text#getter");
  }

  set text(value: string) {
    throw new Error("text#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }

  set type(value: string) {
    throw new Error("type#setter");
  }
}

// deno-lint-ignore no-empty-interface
export interface HTMLAnchorElement extends HTMLHyperlinkElementUtils {}
