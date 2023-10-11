import { Constructor } from "../../deps.ts";
import type { ISVGTests } from "../interface.d.ts";

export function SVGTests<T extends Constructor>(Ctor: T) {
  abstract class SVGTests extends Ctor implements ISVGTests {
    get requiredExtensions(): SVGStringList {
      throw new Error("requiredExtensions");
    }
    get systemLanguage(): SVGStringList {
      throw new Error("requiredExtensions");
    }
  }

  return SVGTests;
}

// deno-lint-ignore no-empty-interface
export interface SVGTests extends ISVGTests {}
