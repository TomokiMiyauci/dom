import * as Fullscreen from "../document.ts";
import * as DOM from "../../../nodes/documents/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/documents/document.ts" {
  interface Document extends Fullscreen.Document {}
}

includes(DOM.Document, Fullscreen.Document);
