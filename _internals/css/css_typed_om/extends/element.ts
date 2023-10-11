import * as CSSTypedOM from "../element.ts";
import * as DOM from "../../../../nodes/element.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../nodes/element.ts" {
  interface Element extends CSSTypedOM.Element {}
}

includes(DOM.Element, CSSTypedOM.Element);
