import { ARIAMixin } from "../aria_mixin.ts";
import { Element } from "../../../nodes/element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends ARIAMixin {}
}

includes(Element, ARIAMixin);
