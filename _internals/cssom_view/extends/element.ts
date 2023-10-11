import * as CSSOMView from "../element.ts";
import * as DOM from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends CSSOMView.Element {}
}

includes(DOM.Element, CSSOMView.Element);
