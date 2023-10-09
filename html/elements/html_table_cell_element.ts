import type { IHTMLTableCellElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTableCellElement")
export class HTMLTableCellElement extends HTMLElement
  implements IHTMLTableCellElement {
  get abbr(): string {
    throw new Error("abbr#getter");
  }
  set abbr(value: string) {
    throw new Error("abbr#setter");
  }

  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get axis(): string {
    throw new Error("axis#getter");
  }
  set axis(value: string) {
    throw new Error("axis#setter");
  }

  get bgColor(): string {
    throw new Error("bgColor#getter");
  }
  set bgColor(value: string) {
    throw new Error("bgColor#setter");
  }

  get cellIndex(): number {
    throw new Error("cellIndex");
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

  get colSpan(): number {
    throw new Error("colSpan#getter");
  }
  set colSpan(value: number) {
    throw new Error("colSpan#setter");
  }

  get headers(): string {
    throw new Error("headers#getter");
  }
  set headers(value: string) {
    throw new Error("headers#setter");
  }

  get height(): string {
    throw new Error("height#getter");
  }
  set height(value: string) {
    throw new Error("height#setter");
  }

  get noWrap(): boolean {
    throw new Error("noWrap#getter");
  }
  set noWrap(value: boolean) {
    throw new Error("noWrap#setter");
  }

  get rowSpan(): number {
    throw new Error("rowSpan#getter");
  }
  set rowSpan(value: number) {
    throw new Error("rowSpan#setter");
  }

  get scope(): string {
    throw new Error("scope#getter");
  }
  set scope(value: string) {
    throw new Error("scope#setter");
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
