import * as Fullscreen from "../document_or_shadow_root.ts";
import * as DOM from "../../../nodes/mixins/document_or_shadow_root.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/mixins/document_or_shadow_root.ts" {
  interface DocumentOrShadowRoot extends Fullscreen.DocumentOrShadowRoot {}
}

includes(DOM.DocumentOrShadowRoot, Fullscreen.DocumentOrShadowRoot);
