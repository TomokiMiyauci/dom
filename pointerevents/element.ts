import { Constructor } from "../deps.ts";
import type { IElement } from "../interface.d.ts";

type IElement_PointerEvents = Pick<
  IElement,
  "setPointerCapture" | "releasePointerCapture" | "hasPointerCapture"
>;

export function Element_PointerEvents<T extends Constructor>(Ctor: T) {
  abstract class Element_PointerEvents extends Ctor
    implements IElement_PointerEvents {
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

  return Element_PointerEvents;
}

// deno-lint-ignore no-empty-interface
export interface Element_PointerEvents extends IElement_PointerEvents {}
