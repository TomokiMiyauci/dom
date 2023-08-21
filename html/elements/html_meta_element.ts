import type { IHTMLMetaElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLMetaElement extends HTMLElement implements IHTMLMetaElement {
  get content(): string {
    throw new Error("content#getter");
  }
  set content(value: string) {
    throw new Error("content#setter");
  }

  get httpEquiv(): string {
    throw new Error("httpEquiv#getter");
  }
  set httpEquiv(value: string) {
    throw new Error("httpEquiv#setter");
  }
  get media(): string {
    throw new Error("media#getter");
  }
  set media(value: string) {
    throw new Error("media#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get scheme(): string {
    throw new Error("scheme#getter");
  }
  set scheme(value: string) {
    throw new Error("scheme#setter");
  }
}
