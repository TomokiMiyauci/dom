import type { ISVGAElement } from "../../../interface.d.ts";
import { SVGGraphicsElement } from "./svg_graphics_element.ts";
import { SVGURIReference } from "../svg_uri_reference.ts";
import { reflect } from "../infrastructure.ts";
import { DOMTokenList } from "../../../dom/sets/dom_token_list.ts";

@SVGURIReference
export class SVGAElement extends SVGGraphicsElement implements ISVGAElement {
  get rel(): string {
    throw new Error("ref#getter");
  }

  set rel(value: string) {
    throw new Error("ref#getter");
  }

  /**
   * @see https://svgwg.org/svg2-draft/linking.html#__svg__SVGAElement__rel
   */
  get relList(): DOMTokenList {
    // reflects the ‘rel’ content attribute.
    return reflect(this, DOMTokenList, "rel");
  }

  get target(): SVGAnimatedString {
    throw new Error("target");
  }
}

// deno-lint-ignore no-empty-interface
export interface SVGAElement extends SVGURIReference {}
