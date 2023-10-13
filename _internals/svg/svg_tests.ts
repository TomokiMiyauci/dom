import type { ISVGTests } from "../interface.d.ts";

export class SVGTests implements ISVGTests {
  get requiredExtensions(): SVGStringList {
    throw new Error("requiredExtensions");
  }
  get systemLanguage(): SVGStringList {
    throw new Error("requiredExtensions");
  }
}
