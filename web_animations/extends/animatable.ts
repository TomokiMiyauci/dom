import { Animatable } from "../animatable.ts";
import { Element } from "../../dom/nodes/elements/element.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/elements/element.ts" {
  interface Element extends Animatable {}
}

includes(Element, Animatable);
