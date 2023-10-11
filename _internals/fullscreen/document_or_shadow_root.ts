import type { IDocumentOrShadowRoot } from "../../interface.d.ts";

export type IDocumentOrShadowRoot_Fullscreen = Pick<
  IDocumentOrShadowRoot,
  "fullscreenElement"
>;

export class DocumentOrShadowRoot implements IDocumentOrShadowRoot_Fullscreen {
  get fullscreenElement(): Element | null {
    throw new Error("fullscreenElement");
  }
}
