import type { IHTMLTableSectionElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { HTMLCollection } from "../../../nodes/node_trees/html_collection.ts";
import { tree } from "../../../internal.ts";
import { SameObject } from "../../webidl/extended_attribute.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTableSectionElement")
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

  @SameObject
  get rows(): HTMLCollectionOf<HTMLTableRowElement> {
    return new HTMLCollection({
      root: this,
      filter: (element) => {
        return isTr(element) && tree.isChild(element, this);
      },
    }) as any as HTMLCollectionOf<HTMLTableRowElement>;
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

function isTr(element: Element): boolean {
  return element.tagName.toLowerCase() === "tr";
}
