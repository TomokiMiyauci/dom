import * as Fullscreen from "../element.ts";
import * as DOM from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends Fullscreen.Element {}
}

includes(DOM.Element, Fullscreen.Element);
