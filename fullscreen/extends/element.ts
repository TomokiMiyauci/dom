import * as Fullscreen from "../element.ts";
import * as DOM from "../../dom/nodes/elements/element.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/elements/element.ts" {
  interface Element extends Fullscreen.Element {}
}

includes(DOM.Element, Fullscreen.Element);
