import type { IElement } from "../interface.d.ts";

type IElement_Fullscreen = Pick<
  IElement,
  "requestFullscreen" | "onfullscreenchange" | "onfullscreenerror"
>;

export class Element implements IElement_Fullscreen {
  requestFullscreen(options?: FullscreenOptions | undefined): Promise<void> {
    throw new Error("requestFullscreen");
  }
  onfullscreenchange: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
  onfullscreenerror: ((this: globalThis.Element, ev: Event) => any) | null =
    null;
}
