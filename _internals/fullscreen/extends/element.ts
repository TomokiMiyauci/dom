import * as Fullscreen from "../element.ts";
import * as DOM from "../../../nodes/elements/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/elements/element.ts" {
  interface Element extends Fullscreen.Element {}
}

includes(DOM.Element, Fullscreen.Element);
