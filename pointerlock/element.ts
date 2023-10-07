import type { IElement } from "../interface.d.ts";

type IElement_PointerLock = Pick<IElement, "requestPointerLock">;

export class Element implements IElement_PointerLock {
  requestPointerLock(): void {
    throw new Error("requestPointerLock");
  }
}
