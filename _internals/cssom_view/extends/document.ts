import * as CSSOMView from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends CSSOMView.Document {}
}

includes(DOM.Document, CSSOMView.Document);
