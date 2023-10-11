import * as Selection from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { extend } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends Selection.Document {}
}

extend(DOM.Document.prototype, new Selection.Document(), { prototype: true });
