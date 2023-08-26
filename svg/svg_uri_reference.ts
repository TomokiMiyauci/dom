import { Constructor } from "../deps.ts";
import type { ISVGURIReference } from "../interface.d.ts";

export function SVGURIReference<T extends Constructor>(Ctor: T) {
  abstract class SVGURIReference extends Ctor implements ISVGURIReference {
    get href(): SVGAnimatedString {
      throw new Error("href");
    }
  }

  return SVGURIReference;
}

// deno-lint-ignore no-empty-interface
export interface SVGURIReference extends ISVGURIReference {}
