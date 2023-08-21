import type { IHTMLStyleElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { LinkStyle } from "../../cssom/link_style.ts";

@LinkStyle
export class HTMLStyleElement extends HTMLElement implements IHTMLStyleElement {
  get disabled(): boolean {
    throw new Error("disabled#getter");
  }
  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get media(): string {
    throw new Error("media#getter");
  }
  set media(value: string) {
    throw new Error("media#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }
}

// deno-lint-ignore no-empty-interface
export interface HTMLStyleElement extends LinkStyle {}
