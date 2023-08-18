import { Constructor } from "../deps.ts";
import type { ILinkStyle } from "../interface.d.ts";

export function LinkStyle<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements LinkStyle {
    get sheet(): CSSStyleSheet | null {
      throw new Error("sheet");
    }
  }

  return Mixin;
}

// deno-lint-ignore no-empty-interface
export interface LinkStyle extends ILinkStyle {}
