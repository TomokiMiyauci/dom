import * as DOM from "../../dom/nodes/documents/document.ts";
import * as HTML from "../document.ts";
import { extend } from "../../utils.ts";

declare module "../../dom/nodes/documents/document.ts" {
  // export interface Document extends HTML.IDocument {}
  export interface DocumentInternals extends HTML.DocumentInternals {}
}

// extend(DOM.Document.prototype, HTML.Document.prototype);
extend(DOM.DocumentInternals.prototype, new HTML.DocumentInternals(), {
  prototype: true,
});
