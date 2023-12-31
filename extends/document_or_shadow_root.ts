import { DocumentOrShadowRoot } from "../nodes/mixins/document_or_shadow_root.ts";
import { Document } from "../nodes/document.ts";
import { ShadowRoot } from "../nodes/shadow_root.ts";
import { IDocumentOrShadowRoot } from "../interface.d.ts";
import { includes } from "../utils.ts";

declare module "../nodes/document.ts" {
  interface Document extends IDocumentOrShadowRoot {}
}

declare module "../nodes/shadow_root.ts" {
  interface ShadowRoot extends IDocumentOrShadowRoot {}
}

includes(Document, DocumentOrShadowRoot);
includes(ShadowRoot, DocumentOrShadowRoot);
