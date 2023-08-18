import { type Constructor } from "../deps.ts";

interface IDocument_CSSOM_View extends
  Pick<
    Document,
    | "elementFromPoint"
    | "elementsFromPoint"
    | "caretRangeFromPoint"
    | "scrollingElement"
  > {}

export function Document_CSSOM_View<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_CSSOM_View {
    get scrollingElement(): Element | null {
      throw new Error();
    }

    caretRangeFromPoint(x: number, y: number): any | null {
      throw new Error();
    }

    elementFromPoint(x: number, y: number): Element | null {
      throw new Error();
    }

    elementsFromPoint(x: number, y: number): Element[] {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_CSSOM_View extends IDocument_CSSOM_View {}
