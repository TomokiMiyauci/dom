import { UnImplemented } from "../../../utils.ts";
import { type IFontFace } from "../../interface.d.ts";

export class FontFace implements IFontFace {
  ascentOverride: string = "";

  descentOverride: string = "";

  display: FontDisplay = "auto";

  family: string = "";
  featureSettings: string = "";
  lineGapOverride: string = "";

  loaded: Promise<FontFace> = new Promise(() => {});

  status: FontFaceLoadStatus = "error";

  stretch: string = "";
  style: string = "";

  unicodeRange: string = "";
  variant: string = "";
  weight: string = "";

  load(): Promise<FontFace> {
    throw new UnImplemented();
  }
}
