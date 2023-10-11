import type { IHTMLSourceElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLSourceElement")
export class HTMLSourceElement extends HTMLElement
  implements IHTMLSourceElement {
  get height(): number {
    throw new Error("height#getter");
  }
  set height(value: number) {
    throw new Error("height#setter");
  }

  get media(): string {
    throw new Error("media#getter");
  }
  set media(value: string) {
    throw new Error("media#setter");
  }

  get sizes(): string {
    throw new Error("sizes#getter");
  }
  set sizes(value: string) {
    throw new Error("sizes#setter");
  }

  get src(): string {
    throw new Error("src#getter");
  }
  set src(value: string) {
    throw new Error("src#setter");
  }

  get srcset(): string {
    throw new Error("srcset#getter");
  }
  set srcset(value: string) {
    throw new Error("srcset#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }
  get width(): number {
    throw new Error("width#getter");
  }
  set width(value: number) {
    throw new Error("width#setter");
  }
}
