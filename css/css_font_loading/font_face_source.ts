import { type IFontFaceSource } from "../../interface.d.ts";
import { UnImplemented } from "../../utils.ts";
import { Constructor } from "../../deps.ts";

export function FontFaceSource<T extends Constructor>(Ctor: T) {
  abstract class FontFaceSourceMixin extends Ctor implements FontFaceSource {
    get fonts(): any {
      throw new UnImplemented();
    }
  }

  return FontFaceSourceMixin;
}

// deno-lint-ignore no-empty-interface
export interface FontFaceSource extends IFontFaceSource {}
