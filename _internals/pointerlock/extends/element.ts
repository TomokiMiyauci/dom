import * as Pointerlock from "../element.ts";
import * as DOM from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends Pointerlock.Element {}
}

includes(DOM.Element, Pointerlock.Element);
