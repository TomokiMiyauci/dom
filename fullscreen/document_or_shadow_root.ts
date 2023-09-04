import { type Constructor } from "../deps.ts";
import type { IDocumentOrShadowRoot } from "../interface.d.ts";

export type IDocumentOrShadowRoot_Fullscreen = Pick<
  IDocumentOrShadowRoot,
  "fullscreenElement"
>;

export function DocumentOrShadowRoot_Fullscreen<T extends Constructor>(
  Ctor: T,
) {
  abstract class DocumentOrShadowRoot_Fullscreen extends Ctor
    implements IDocumentOrShadowRoot_Fullscreen {
    get fullscreenElement(): Element | null {
      throw new Error("fullscreenElement");
    }
  }

  return DocumentOrShadowRoot_Fullscreen;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot_Fullscreen
  extends IDocumentOrShadowRoot_Fullscreen {}
