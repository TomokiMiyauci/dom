import { type IFontFaceSource } from "../../interface.d.ts";

export class FontFaceSource implements IFontFaceSource {
  get fonts(): any {
    throw new Error();
  }
}
