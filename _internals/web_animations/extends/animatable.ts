import { Animatable } from "../animatable.ts";
import { Element } from "../../../nodes/elements/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/elements/element.ts" {
  interface Element extends Animatable {}
}

includes(Element, Animatable);
