import * as CSSShadowParts from "../element.ts";
import * as DOM from "../../../../dom/nodes/elements/element.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../dom/nodes/elements/element.ts" {
  interface Element extends CSSShadowParts.Element {}
}

includes(DOM.Element, CSSShadowParts.Element);
