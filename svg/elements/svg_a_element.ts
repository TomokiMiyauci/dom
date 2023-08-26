import type { ISVGAElement } from "../../interface.d.ts";
import { SVGGraphicsElement } from "./svg_graphics_element.ts";
import { SVGURIReference } from "../svg_uri_reference.ts";

@SVGURIReference
export class SVGAElement extends SVGGraphicsElement implements ISVGAElement {
  get rel(): string {
    throw new Error("ref#getter");
  }

  set rel(value: string) {
    throw new Error("ref#getter");
  }

  get relList(): DOMTokenList {
    throw new Error("relList");
  }

  get target(): SVGAnimatedString {
    throw new Error("target");
  }
}

// deno-lint-ignore no-empty-interface
export interface SVGAElement extends SVGURIReference {}
