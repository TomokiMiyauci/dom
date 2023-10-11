import type { IHTMLTableRowElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { HTMLCollection } from "../../../nodes/node_trees/html_collection.ts";
import { SameObject } from "../../webidl/extended_attribute.ts";
import { tree } from "../../../internal.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTableRowElement")
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

  @SameObject
  get cells(): HTMLCollectionOf<HTMLTableCellElement> {
    return new HTMLCollection({
      root: this,
      filter: (element) => {
        return (isTd(element) || isTh(element)) && tree.isChild(element, this);
      },
    }) as any as HTMLCollectionOf<HTMLTableCellElement>;
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

function isTd(element: Element): boolean {
  return element.tagName.toLowerCase() === "td";
}

function isTh(element: Element): boolean {
  return element.tagName.toLowerCase() === "th";
}
