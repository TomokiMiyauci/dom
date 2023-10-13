import { SVGURIReference } from "../svg_uri_reference.ts";
import { SVGAElement } from "../elements/svg_a_element.ts";
import { includes } from "../../../utils.ts";

declare module "../elements/svg_a_element.ts" {
  interface SVGAElement extends SVGURIReference {}
}

includes(SVGAElement, SVGURIReference)
