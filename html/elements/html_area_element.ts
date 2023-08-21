import type { IHTMLAreaElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { HTMLHyperlinkElementUtils } from "../html_hyperlink_element_utils.ts";

@HTMLHyperlinkElementUtils
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

  get relList(): DOMTokenList {
    throw new Error("rel#getter");
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
