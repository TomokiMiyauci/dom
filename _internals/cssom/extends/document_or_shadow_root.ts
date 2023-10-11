import * as CSSOM from "../document_or_shadow_root.ts";
import * as DOM from "../../../nodes/node_trees/document_or_shadow_root.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/node_trees/document_or_shadow_root.ts" {
  interface DocumentOrShadowRoot extends CSSOM.DocumentOrShadowRoot {}
}

includes(DOM.DocumentOrShadowRoot, CSSOM.DocumentOrShadowRoot);
