import { type Constructor } from "../deps.ts";
import type { IDocumentOrShadowRoot } from "../interface.d.ts";

export type IDocumentOrShadowRoot_WebAnimations = Pick<
  IDocumentOrShadowRoot,
  "getAnimations"
>;

export function DocumentOrShadowRoot_WebAnimations<T extends Constructor>(
  Ctor: T,
) {
  abstract class DocumentOrShadowRoot_WebAnimations extends Ctor
    implements IDocumentOrShadowRoot_WebAnimations {
    getAnimations(): any[] {
      throw new Error("getAnimations");
    }
  }

  return DocumentOrShadowRoot_WebAnimations;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot_WebAnimations
  extends IDocumentOrShadowRoot_WebAnimations {}
