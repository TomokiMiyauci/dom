import { Constructor } from "../deps.ts";
import type { IElement } from "../interface.d.ts";

type IElement_PointerLock = Pick<IElement, "requestPointerLock">;

export function Element_PointerLock<T extends Constructor>(Ctor: T) {
  abstract class Element_PointerLock extends Ctor
    implements IElement_PointerLock {
    requestPointerLock(): void {
      throw new Error("requestPointerLock");
    }
  }

  return Element_PointerLock;
}

// deno-lint-ignore no-empty-interface
export interface Element_PointerLock extends IElement_PointerLock {}
