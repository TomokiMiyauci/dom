import { type Constructor } from "../deps.ts";

interface IDocument_Pointerlock extends
  Pick<
    Document,
    "onpointerlockchange" | "onpointerlockerror" | "exitPointerLock"
  > {}

export function Document_Pointerlock<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_Pointerlock {
    onpointerlockchange:
      | ((this: globalThis.Document, ev: Event) => any)
      | null = null;
    onpointerlockerror: ((this: globalThis.Document, ev: Event) => any) | null =
      null;

    exitPointerLock(): void {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_Pointerlock extends IDocument_Pointerlock {}
