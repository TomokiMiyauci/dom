import * as CSSTypedOM from "../element.ts";
import * as DOM from "../../../dom/nodes/elements/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../dom/nodes/elements/element.ts" {
  interface Element extends CSSTypedOM.Element {}
}

includes(DOM.Element, CSSTypedOM.Element);
