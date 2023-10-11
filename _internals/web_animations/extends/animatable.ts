import { Animatable } from "../animatable.ts";
import { Element } from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends Animatable {}
}

includes(Element, Animatable);
