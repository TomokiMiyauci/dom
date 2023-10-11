import type { IHTMLTableElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { HTMLCollection } from "../../../nodes/html_collection.ts";
import { tree } from "../../../internal.ts";
import { SameObject } from "../../webidl/extended_attribute.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { removeNode } from "../../../nodes/mutation.ts";
import { isElement } from "../../../nodes/utils/type.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTableElement")
export class HTMLTableElement extends HTMLElement implements IHTMLTableElement {
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

  get border(): string {
    throw new Error("border#getter");
  }
  set border(value: string) {
    throw new Error("border#setter");
  }

  get caption(): HTMLTableCaptionElement | null {
    throw new Error("caption#getter");
  }
  set caption(value: HTMLTableCaptionElement | null) {
    throw new Error("caption#setter");
  }

  get cellPadding(): string {
    throw new Error("cellPadding#getter");
  }
  set cellPadding(value: string) {
    throw new Error("cellPadding#setter");
  }

  get cellSpacing(): string {
    throw new Error("cellSpacing#getter");
  }
  set cellSpacing(value: string) {
    throw new Error("cellSpacing#setter");
  }

  get frame(): string {
    throw new Error("frame#getter");
  }
  set frame(value: string) {
    throw new Error("frame#setter");
  }

  get rows(): HTMLCollectionOf<HTMLTableRowElement> {
    return new HTMLCollection({
      root: this,
      filter: (element) => {
        if (!isTr(element)) return false;
        if (tree.isChild(element, this)) return true;

        const parent = tree.parent(element);

        if (!parent || !isElement(parent)) return false;

        return isTHead(parent) || isTBody(parent) || isTFoot(parent);
      },
    }) as any as HTMLCollectionOf<HTMLTableRowElement>;
  }

  get rules(): string {
    throw new Error("rules#getter");
  }
  set rules(value: string) {
    throw new Error("rules#setter");
  }

  get summary(): string {
    throw new Error("summary#getter");
  }
  set summary(value: string) {
    throw new Error("summary#setter");
  }

  @SameObject
  get tBodies(): HTMLCollectionOf<HTMLTableSectionElement> {
    // return an HTMLCollection rooted at the table node, whose filter matches only tbody elements that are children of the table element.
    return new HTMLCollection({
      root: this,
      filter: (element) => {
        return isTBody(element) && tree.isChild(element, this);
      },
    }) as any as HTMLCollectionOf<HTMLTableSectionElement>;
  }

  get tFoot(): HTMLTableSectionElement | null {
    throw new Error("tFoot#getter");
  }
  set tFoot(value: HTMLTableSectionElement | null) {
    throw new Error("tFoot#setter");
  }

  get tHead(): HTMLTableSectionElement | null {
    throw new Error("tHead#getter");
  }
  set tHead(value: HTMLTableSectionElement | null) {
    throw new Error("tHead#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }

  createCaption(): HTMLTableCaptionElement {
    throw new Error("createCaption");
  }

  createTBody(): HTMLTableSectionElement {
    throw new Error("createTBody");
  }

  createTFoot(): HTMLTableSectionElement {
    throw new Error("createTFoot");
  }

  createTHead(): HTMLTableSectionElement {
    throw new Error("createTHead");
  }

  deleteCaption(): void {
    throw new Error("deleteCaption");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/tables.html#dom-table-deleterow)
   */
  deleteRow(index: number): void {
    const rows = this.rows;
    const length = rows.length;
    // 1. If index is less than −1 or greater than or equal to the number of elements in the rows collection,
    if (index < -1 || index >= length) {
      // then throw an "IndexSizeError" DOMException.
      throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
    }

    // 2. If index is −1,
    if (index === -1) {
      // then remove the last element in the rows collection from its parent, or do nothing if the rows collection is empty.
      const lastElement = rows[length];
      if (!rows.length || !lastElement) return;

      removeNode(lastElement);
    } // 3. Otherwise,
    else {
      // remove the indexth element in the rows collection from its parent.
      const node = rows[index];
      if (node) removeNode(node);
    }
  }

  deleteTFoot(): void {
    throw new Error("deleteTFoot");
  }

  deleteTHead(): void {
    throw new Error("deleteTHead");
  }

  insertRow(index?: number): HTMLTableRowElement {
    throw new Error("insertRow");
  }
}

function isTBody(element: Element): boolean {
  return element.tagName.toLowerCase() === "tbody";
}

function isTHead(element: Element): boolean {
  return element.tagName.toLowerCase() === "thead";
}

function isTFoot(element: Element): boolean {
  return element.tagName.toLowerCase() === "tfoot";
}

function isTr(element: Element): boolean {
  return element.tagName.toLowerCase() === "tr";
}
