import { Element } from "../nodes/element.ts";
import { Text } from "../nodes/text.ts";
import { Slottable } from "../nodes/slottable.ts";
import { ISlottable } from "../interface.d.ts";
import { includes } from "../utils.ts";

declare module "../nodes/element.ts" {
  interface Element extends ISlottable {}
}

declare module "../nodes/text.ts" {
  interface Text extends ISlottable {}
}

includes(Element, Slottable);
includes(Text, Slottable);
