import type { IElement } from "../../interface.d.ts";

type IElement_PointerEvents = Pick<
  IElement,
  "setPointerCapture" | "releasePointerCapture" | "hasPointerCapture"
>;

export class Element implements IElement_PointerEvents {
  hasPointerCapture(pointerId: number): boolean {
    throw new Error("hasPointerCapture");
  }

  setPointerCapture(pointerId: number): void {
    throw new Error("setPointerCapture");
  }

  releasePointerCapture(pointerId: number): void {
    throw new Error("releasePointerCapture");
  }
}
