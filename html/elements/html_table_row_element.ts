import type { IHTMLTableRowElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTableRowElement extends HTMLElement
  implements IHTMLTableRowElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get bgColor(): string {
    throw new Error("bgColor#getter");
  }
  set bgColor(value: string) {
    throw new Error("bgColor#setter");
  }

  get cells(): HTMLCollectionOf<HTMLTableCellElement> {
    throw new Error("cells#getter");
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

  get rowIndex(): number {
    throw new Error("rowIndex");
  }

  get sectionRowIndex(): number {
    throw new Error("sectionRowIndex");
  }

  get vAlign(): string {
    throw new Error("vAlign#getter");
  }
  set vAlign(value: string) {
    throw new Error("vAlign#setter");
  }

  deleteCell(index: number): void {
    throw new Error("deleteCell");
  }

  insertCell(index?: number): HTMLTableCellElement {
    throw new Error("insertCell");
  }
}
