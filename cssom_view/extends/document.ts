import * as CSSOMView from "../document.ts";
import * as DOM from "../../dom/nodes/documents/document.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/documents/document.ts" {
  interface Document extends CSSOMView.Document {}
}

includes(DOM.Document, CSSOMView.Document);
