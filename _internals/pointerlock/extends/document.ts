import * as Pointerlock from "../document.ts";
import * as DOM from "../../../nodes/documents/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/documents/document.ts" {
  interface Document extends Pointerlock.Document {}
}

includes(DOM.Document, Pointerlock.Document);
