import * as WebAnimations from "../document_or_shadow_root.ts";
import * as DOM from "../../dom/nodes/node_trees/document_or_shadow_root.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/node_trees/document_or_shadow_root.ts" {
  interface DocumentOrShadowRoot extends WebAnimations.DocumentOrShadowRoot {}
}

includes(DOM.DocumentOrShadowRoot, WebAnimations.DocumentOrShadowRoot);
