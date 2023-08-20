import { Constructor } from "../deps.ts";
import type { IElement } from "../interface.d.ts";

type IElement_DomParsing = Pick<
  IElement,
  "outerHTML" | "insertAdjacentHTML"
>;

export function Element_DomParsing<T extends Constructor>(Ctor: T) {
  abstract class Element_DomParsing extends Ctor
    implements IElement_DomParsing {
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

  return Element_DomParsing;
}

// deno-lint-ignore no-empty-interface
export interface Element_DomParsing extends IElement_DomParsing {}
