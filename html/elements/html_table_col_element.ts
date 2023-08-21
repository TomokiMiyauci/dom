import type { IHTMLTableColElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTableColElement extends HTMLElement
  implements IHTMLTableColElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get ch(): string {
    throw new Error("ch#getter");
  }
  set ch(value: string) {
    throw new Error("ch#setter");
  }

  get chOff(): string {
    throw new Error("chOff#getter");
  }
  set chOff(value: string) {
    throw new Error("chOff#setter");
  }

  get span(): number {
    throw new Error("span#getter");
  }
  set span(value: number) {
    throw new Error("span#setter");
  }

  get vAlign(): string {
    throw new Error("vAlign#getter");
  }
  set vAlign(value: string) {
    throw new Error("vAlign#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }
}
