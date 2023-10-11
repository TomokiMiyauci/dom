import * as Selection from "../document.ts";
import * as DOM from "../../../dom/nodes/documents/document.ts";
import { extend } from "../../../utils.ts";

declare module "../../../dom/nodes/documents/document.ts" {
  interface Document extends Selection.Document {}
}

extend(DOM.Document.prototype, new Selection.Document(), { prototype: true });
