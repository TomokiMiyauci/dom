import type { IDocumentOrShadowRoot } from "../../interface.d.ts";

export type IDocumentOrShadowRoot_Pointerlock = Pick<
  IDocumentOrShadowRoot,
  "pointerLockElement"
>;

export class DocumentOrShadowRoot implements IDocumentOrShadowRoot_Pointerlock {
  get pointerLockElement(): Element | null {
    throw new Error("pointerLockElement");
  }
}
