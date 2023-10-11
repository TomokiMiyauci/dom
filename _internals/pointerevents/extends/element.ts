import * as Pointerevents from "../element.ts";
import * as DOM from "../../../dom/nodes/elements/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../dom/nodes/elements/element.ts" {
  interface Element extends Pointerevents.Element {}
}

includes(DOM.Element, Pointerevents.Element);
