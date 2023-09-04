import { type Constructor } from "../deps.ts";
import type { IDocumentOrShadowRoot } from "../interface.d.ts";

export type IDocumentOrShadowRoot_Pointerlock = Pick<
  IDocumentOrShadowRoot,
  "pointerLockElement"
>;

export function DocumentOrShadowRoot_Pointerlock<T extends Constructor>(
  Ctor: T,
) {
  abstract class DocumentOrShadowRoot_Pointerlock extends Ctor
    implements IDocumentOrShadowRoot_Pointerlock {
    get pointerLockElement(): Element | null {
      throw new Error("pointerLockElement");
    }
  }

  return DocumentOrShadowRoot_Pointerlock;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot_Pointerlock
  extends IDocumentOrShadowRoot_Pointerlock {}
