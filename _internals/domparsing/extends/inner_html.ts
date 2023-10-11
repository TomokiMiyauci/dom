import { InnerHTML } from "../inner_html.ts";
import { IInnerHTML } from "../../interface.d.ts";
import { Element } from "../../../nodes/element.ts";
import { ShadowRoot } from "../../../nodes/shadow_root.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface Element extends IInnerHTML {}
}

declare module "../../../nodes/shadow_root.ts" {
  interface ShadowRoot extends IInnerHTML {}
}

includes(Element, InnerHTML);
includes(ShadowRoot, InnerHTML);
