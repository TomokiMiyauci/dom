import type { ISVGGraphicsElement } from "../../interface.d.ts";
import { SVGElement } from "./svg_element.ts";
import { SVGTests } from "../svg_tests.ts";

@SVGTests
export class SVGGraphicsElement extends SVGElement
  implements ISVGGraphicsElement {
  get transform(): SVGAnimatedTransformList {
    throw new Error("transform");
  }
  getBBox(options?: SVGBoundingBoxOptions): DOMRect {
    throw new Error("getBBox");
  }
  getCTM(): DOMMatrix | null {
    throw new Error("getCTM");
  }
  getScreenCTM(): DOMMatrix | null {
    throw new Error("getScreenCTM");
  }
}

// deno-lint-ignore no-empty-interface
export interface SVGGraphicsElement extends SVGTests {}
