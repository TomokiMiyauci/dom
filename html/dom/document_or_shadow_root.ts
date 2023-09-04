import { type Constructor } from "../../deps.ts";
import type { IDocumentOrShadowRoot } from "../../interface.d.ts";

export type IDocumentOrShadowRoot_HTML = Pick<
  IDocumentOrShadowRoot,
  "activeElement"
>;

export function DocumentOrShadowRoot_HTML<T extends Constructor>(Ctor: T) {
  abstract class DocumentOrShadowRoot_HTML extends Ctor
    implements IDocumentOrShadowRoot_HTML {
    get activeElement(): Element | null {
      throw new Error("activeElement");
    }
  }

  return DocumentOrShadowRoot_HTML;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot_HTML extends IDocumentOrShadowRoot_HTML {}
