import * as HTML from "../document.ts";
import * as DOM from "../../../dom/nodes/documents/document.ts";
import * as Obsolete from "../obsolete.ts";
import { extend, includes } from "../../../utils.ts";

declare module "../document.ts" {
  interface IDocument_HTML extends Obsolete.Document {}
}

declare module "../../../dom/nodes/documents/document.ts" {
  interface Document extends HTML.IDocument_HTML {}
  interface DocumentInternals extends HTML.DocumentInternals {}
}

extend(DOM.DocumentInternals.prototype, new HTML.DocumentInternals(), {
  prototype: true,
});

includes(HTML.Document, Obsolete.Document);
includes(DOM.Document, HTML.Document);
