import type { ISVGURIReference } from "../interface.d.ts";

export class SVGURIReference implements ISVGURIReference {
  get href(): SVGAnimatedString {
    throw new Error("href");
  }
}
