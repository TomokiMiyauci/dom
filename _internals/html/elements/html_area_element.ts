import type { IHTMLAreaElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { HTMLHyperlinkElementUtils } from "../html_hyperlink_element_utils.ts";
import { DOMTokenList } from "../../../sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@HTMLHyperlinkElementUtils
@Exposed("Window", "HTMLAreaElement")
export class HTMLAreaElement extends HTMLElement implements IHTMLAreaElement {
  get alt(): string {
    throw new Error("alt#getter");
  }

  set alt(value: string) {
    throw new Error("alt#setter");
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

  get noHref(): boolean {
    throw new Error("noHref#getter");
  }

  set noHref(value: boolean) {
    throw new Error("noHref#setter");
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
   * @see https://html.spec.whatwg.org/multipage/image-maps.html#dom-area-rellist
   */
  @SameObject
  @PutForwards("value")
  get relList(): DOMTokenList {
    // reflect the rel content attribute.
    return reflect(this, DOMTokenList, "rel");
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
}

// deno-lint-ignore no-empty-interface
export interface HTMLAreaElement extends HTMLHyperlinkElementUtils {}
