import { type IFontFaceSet } from "../../interface.d.ts";
import { UnImplemented } from "../../utils.ts";

export class FontFaceSet extends EventTarget implements IFontFaceSet {
  load(font: string, text?: string | undefined): any {
  }

  get ready(): Promise<globalThis.FontFaceSet> {
    throw new UnImplemented();
  }

  get status(): any {
    throw new UnImplemented();
  }

  check(font: string, text?: string | undefined): boolean {
    throw new UnImplemented();
  }

  get onloading(): ((this: globalThis.FontFaceSet, ev: Event) => any) | null {
    throw new UnImplemented();
  }

  set onloading(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new UnImplemented();
  }

  get onloadingdone():
    | ((this: globalThis.FontFaceSet, ev: Event) => any)
    | null {
    throw new UnImplemented();
  }

  set onloadingdone(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new UnImplemented();
  }

  get onloadingerror():
    | ((this: globalThis.FontFaceSet, ev: Event) => any)
    | null {
    throw new UnImplemented();
  }

  set onloadingerror(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new UnImplemented();
  }
}

export interface FontFaceSet extends Set<FontFace> {}
