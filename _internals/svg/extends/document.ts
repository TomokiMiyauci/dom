import * as SVG from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends SVG.Document {}
}

includes(DOM.Document, SVG.Document);
