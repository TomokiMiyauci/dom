import { type Constructor } from "../deps.ts";

interface IDocument_Fullscreen extends
  Pick<
    Document,
    | "fullscreen"
    | "fullscreenEnabled"
    | "exitFullscreen"
    | "onfullscreenchange"
    | "onfullscreenerror"
  > {}

export function Document_Fullscreen<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_Fullscreen {
    get fullscreen(): boolean {
      throw new Error();
    }

    get fullscreenEnabled(): boolean {
      throw new Error();
    }

    exitFullscreen(): Promise<void> {
      throw new Error();
    }

    onfullscreenchange: ((this: globalThis.Document, ev: Event) => any) | null =
      null;

    onfullscreenerror: ((this: globalThis.Document, ev: Event) => any) | null =
      null;
  }

  return Mixin;
}

export interface Document_Fullscreen extends IDocument_Fullscreen {}
