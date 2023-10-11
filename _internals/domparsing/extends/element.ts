import * as DOMParsing from "../element.ts";
import * as DOM from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends DOMParsing.Element {}
}

includes(DOM.Element, DOMParsing.Element);
