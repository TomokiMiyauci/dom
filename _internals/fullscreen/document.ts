interface IDocument_Fullscreen extends
  Pick<
    Document,
    | "fullscreen"
    | "fullscreenEnabled"
    | "exitFullscreen"
    | "onfullscreenchange"
    | "onfullscreenerror"
  > {}

export class Document implements IDocument_Fullscreen {
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
