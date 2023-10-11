import type { IDocumentOrShadowRoot } from "../interface.d.ts";

export type IDocumentOrShadowRoot_CSSOM = Pick<
  IDocumentOrShadowRoot,
  "styleSheets" | "adoptedStyleSheets"
>;

export class DocumentOrShadowRoot implements IDocumentOrShadowRoot_CSSOM {
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
