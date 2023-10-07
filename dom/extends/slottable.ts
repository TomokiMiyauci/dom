import { Element } from "../nodes/elements/element.ts";
import { Text } from "../nodes/text.ts";
import { Slottable } from "../nodes/node_trees/slottable.ts";
import { ISlottable } from "../../interface.d.ts";
import { includes } from "../../utils.ts";

declare module "../nodes/elements/element.ts" {
  interface Element extends ISlottable {}
}

declare module "../nodes/text.ts" {
  interface Text extends ISlottable {}
}

includes(Element, Slottable);
includes(Text, Slottable);
