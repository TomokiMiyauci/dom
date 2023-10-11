import type { IDocumentOrShadowRoot } from "../../../interface.d.ts";

export type IDocumentOrShadowRoot_HTML = Pick<
  IDocumentOrShadowRoot,
  "activeElement"
>;

export class DocumentOrShadowRoot implements IDocumentOrShadowRoot_HTML {
  get activeElement(): Element | null {
    throw new Error("activeElement");
  }
}
