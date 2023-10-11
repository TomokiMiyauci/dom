import type { IElement } from "../../interface.d.ts";

type IElement_DomParsing = Pick<
  IElement,
  "outerHTML" | "insertAdjacentHTML"
>;

export class Element implements IElement_DomParsing {
  get outerHTML(): string {
    throw new Error("outerHTML");
  }

  set outerHTML(value: string) {
    throw new Error("outerHTML");
  }

  insertAdjacentHTML(position: InsertPosition, text: string): void {
    throw new Error("insertAdjacentHTML");
  }
}
