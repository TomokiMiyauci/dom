import type { IHTMLLinkElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../../sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLLinkElement")
export class HTMLLinkElement extends HTMLElement implements IHTMLLinkElement {
  get as(): string {
    throw new Error("as#getter");
  }
  set as(value: string) {
    throw new Error("as#setter");
  }

  get charset(): string {
    throw new Error("charset#getter");
  }
  set charset(value: string) {
    throw new Error("charset#setter");
  }

  get crossOrigin(): string | null {
    throw new Error("crossOrigin#getter");
  }
  set crossOrigin(value: string | null) {
    throw new Error("crossOrigin#setter");
  }
  get disabled(): boolean {
    throw new Error("disabled#getter");
  }
  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get href(): string {
    throw new Error("href#getter");
  }
  set href(value: string) {
    throw new Error("href#setter");
  }

  get hreflang(): string {
    throw new Error("hreflang#getter");
  }
  set hreflang(value: string) {
    throw new Error("hreflang#setter");
  }
  get imageSizes(): string {
    throw new Error("imageSizes#getter");
  }
  set imageSizes(value: string) {
    throw new Error("imageSizes#setter");
  }
  get imageSrcset(): string {
    throw new Error("imageSrcset#getter");
  }
  set imageSrcset(value: string) {
    throw new Error("imageSrcset#setter");
  }
  get integrity(): string {
    throw new Error("integrity#getter");
  }
  set integrity(value: string) {
    throw new Error("integrity#setter");
  }

  get media(): string {
    throw new Error("media#getter");
  }
  set media(value: string) {
    throw new Error("media#setter");
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
   * @see https://html.spec.whatwg.org/multipage/semantics.html#dom-link-rellist
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

  /**
   * @see https://html.spec.whatwg.org/multipage/semantics.html#dom-link-sizes
   */
  @SameObject
  @PutForwards("value")
  get sizes(): DOMTokenList {
    // reflect the respective content attributes of the same name.
    return reflect(this, DOMTokenList, "sizes");
  }

  get target(): string {
    throw new Error("target#getter");
  }
  set target(value: string) {
    throw new Error("target#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }
}
