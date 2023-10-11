import * as WebAnimations from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends WebAnimations.Document {}
}

includes(DOM.Document, WebAnimations.Document);
