import { type Constructor } from "../deps.ts";
import type { IDocumentOrShadowRoot } from "../interface.d.ts";

export type IDocumentOrShadowRoot_CSSOM = Pick<
  IDocumentOrShadowRoot,
  "styleSheets" | "adoptedStyleSheets"
>;

export function DocumentOrShadowRoot_CSSOM<T extends Constructor>(Ctor: T) {
  abstract class DocumentOrShadowRoot_CSSOM extends Ctor
    implements IDocumentOrShadowRoot_CSSOM {
    get adoptedStyleSheets(): CSSStyleSheet[] {
      throw new Error("adoptedStyleSheets");
    }

    set adoptedStyleSheets(value: CSSStyleSheet[]) {
      throw new Error("adoptedStyleSheets");
    }

    get styleSheets(): StyleSheetList {
      throw new Error("styleSheets");
    }
  }

  return DocumentOrShadowRoot_CSSOM;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot_CSSOM
  extends IDocumentOrShadowRoot_CSSOM {}
