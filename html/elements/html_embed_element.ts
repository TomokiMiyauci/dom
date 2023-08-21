import type { IHTMLEmbedElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLEmbedElement extends HTMLElement implements IHTMLEmbedElement {
  get align(): string {
    throw new Error("align#getter");
  }

  set align(value: string) {
    throw new Error("align#setter");
  }

  get height(): string {
    throw new Error("height#getter");
  }

  set height(value: string) {
    throw new Error("height#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }

  set name(value: string) {
    throw new Error("name#setter");
  }

  get src(): string {
    throw new Error("src#getter");
  }

  set src(value: string) {
    throw new Error("src#setter");
  }

  get typetype(): string {
    throw new Error("type#getter");
  }

  set type(value: string) {
    throw new Error("type#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }

  set width(value: string) {
    throw new Error("width#setter");
  }

  getSVGDocument(): Document | null {
    throw new Error("getSVGDocument");
  }
}
