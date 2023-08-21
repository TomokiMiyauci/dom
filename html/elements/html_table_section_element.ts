import type { IHTMLTableSectionElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTableSectionElement extends HTMLElement
  implements IHTMLTableSectionElement {
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

  get rows(): HTMLCollectionOf<HTMLTableRowElement> {
    throw new Error("rows#getter");
  }

  get vAlign(): string {
    throw new Error("vAlign#getter");
  }
  set vAlign(value: string) {
    throw new Error("vAlign#setter");
  }

  deleteRow(index: number): void {
    throw new Error("deleteRow");
  }

  insertRow(index?: number): HTMLTableRowElement {
    throw new Error("insertRow");
  }
}
