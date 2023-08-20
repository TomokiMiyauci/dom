import { Constructor } from "../deps.ts";
import type { IElement } from "../interface.d.ts";

type IElement_Fullscreen = Pick<
  IElement,
  "requestFullscreen" | "onfullscreenchange" | "onfullscreenerror"
>;

export function Element_Fullscreen<T extends Constructor>(Ctor: T) {
  abstract class Element_Fullscreen extends Ctor
    implements IElement_Fullscreen {
    requestFullscreen(options?: FullscreenOptions | undefined): Promise<void> {
      throw new Error("requestFullscreen");
    }
    onfullscreenchange: ((this: globalThis.Element, ev: Event) => any) | null =
      null;
    onfullscreenerror: ((this: globalThis.Element, ev: Event) => any) | null =
      null;
  }

  return Element_Fullscreen;
}

// deno-lint-ignore no-empty-interface
export interface Element_Fullscreen extends IElement_Fullscreen {}
