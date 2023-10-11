import * as Fullscreen from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends Fullscreen.Document {}
}

includes(DOM.Document, Fullscreen.Document);
