import * as Pointerevents from "../element.ts";
import * as DOM from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends Pointerevents.Element {}
}

includes(DOM.Element, Pointerevents.Element);
