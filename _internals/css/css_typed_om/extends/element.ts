import * as CSSTypedOM from "../element.ts";
import * as DOM from "../../../../nodes/elements/element.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../nodes/elements/element.ts" {
  interface Element extends CSSTypedOM.Element {}
}

includes(DOM.Element, CSSTypedOM.Element);
