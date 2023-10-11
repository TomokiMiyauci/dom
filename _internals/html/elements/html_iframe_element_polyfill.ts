import { ContentNavigableInternals } from "./html_iframe_element.ts";
import { ElementInternals } from "../../../nodes/element.ts";
import { extend } from "../../../utils.ts";

declare module "../../../nodes/element.ts" {
  interface ElementInternals extends ContentNavigableInternals {}
}

extend(ElementInternals.prototype, new ContentNavigableInternals());
