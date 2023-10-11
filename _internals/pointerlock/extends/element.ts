import * as Pointerlock from "../element.ts";
import * as DOM from "../../../nodes/elements/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/elements/element.ts" {
  interface Element extends Pointerlock.Element {}
}

includes(DOM.Element, Pointerlock.Element);
