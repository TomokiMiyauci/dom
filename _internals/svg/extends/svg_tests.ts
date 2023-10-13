import { SVGTests } from "../svg_tests.ts";
import { SVGGraphicsElement } from "../elements/svg_graphics_element.ts";
import { includes } from "../../../utils.ts";

declare module "../elements/svg_graphics_element.ts" {
  interface SVGGraphicsElement extends SVGTests {}
}

includes(SVGGraphicsElement, SVGTests);
