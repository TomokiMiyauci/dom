import type { IDocumentOrShadowRoot } from "../../interface.d.ts";

export type IDocumentOrShadowRoot_WebAnimations = Pick<
  IDocumentOrShadowRoot,
  "getAnimations"
>;

export class DocumentOrShadowRoot
  implements IDocumentOrShadowRoot_WebAnimations {
  getAnimations(): any[] {
    throw new Error("getAnimations");
  }
}
