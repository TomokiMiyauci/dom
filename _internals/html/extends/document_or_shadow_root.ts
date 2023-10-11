import * as HTML from "../dom/document_or_shadow_root.ts";
import * as DOM from "../../../nodes/document_or_shadow_root.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document_or_shadow_root.ts" {
  interface DocumentOrShadowRoot extends HTML.DocumentOrShadowRoot {}
}

includes(DOM.DocumentOrShadowRoot, HTML.DocumentOrShadowRoot);
