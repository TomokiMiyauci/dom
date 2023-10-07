import type { ILinkStyle } from "../interface.d.ts";

export class LinkStyle implements ILinkStyle {
  get sheet(): CSSStyleSheet | null {
    throw new Error("sheet");
  }
}
