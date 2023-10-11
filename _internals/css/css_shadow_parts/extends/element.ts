import * as CSSShadowParts from "../element.ts";
import * as DOM from "../../../../nodes/element.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../nodes/element.ts" {
  interface Element extends CSSShadowParts.Element {}
}

includes(DOM.Element, CSSShadowParts.Element);
