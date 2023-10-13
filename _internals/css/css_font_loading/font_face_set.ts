import { type IFontFaceSet } from "../../interface.d.ts";

export class FontFaceSet extends EventTarget implements IFontFaceSet {
  load(font: string, text?: string | undefined): any {
  }

  get ready(): Promise<globalThis.FontFaceSet> {
    throw new Error();
  }

  get status(): any {
    throw new Error();
  }

  check(font: string, text?: string | undefined): boolean {
    throw new Error();
  }

  get onloading(): ((this: globalThis.FontFaceSet, ev: Event) => any) | null {
    throw new Error();
  }

  set onloading(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new Error();
  }

  get onloadingdone():
    | ((this: globalThis.FontFaceSet, ev: Event) => any)
    | null {
    throw new Error();
  }

  set onloadingdone(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new Error();
  }

  get onloadingerror():
    | ((this: globalThis.FontFaceSet, ev: Event) => any)
    | null {
    throw new Error();
  }

  set onloadingerror(
    value: ((this: globalThis.FontFaceSet, ev: Event) => any) | null,
  ) {
    throw new Error();
  }
}

export interface FontFaceSet extends Set<FontFace> {}
