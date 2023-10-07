import { InnerHTML } from "../inner_html.ts";
import { IInnerHTML } from "../../interface.d.ts";
import { Element } from "../../dom/nodes/elements/element.ts";
import { ShadowRoot } from "../../dom/nodes/shadow_root.ts";
import { includes } from "../../utils.ts";

declare module "../../dom/nodes/elements/element.ts" {
  interface Element extends IInnerHTML {}
}

declare module "../../dom/nodes/shadow_root.ts" {
  interface ShadowRoot extends IInnerHTML {}
}

includes(Element, InnerHTML);
includes(ShadowRoot, InnerHTML);
