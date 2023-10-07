interface IDocument_Pointerlock extends
  Pick<
    Document,
    "onpointerlockchange" | "onpointerlockerror" | "exitPointerLock"
  > {}

export class Document implements IDocument_Pointerlock {
  onpointerlockchange:
    | ((this: globalThis.Document, ev: Event) => any)
    | null = null;
  onpointerlockerror: ((this: globalThis.Document, ev: Event) => any) | null =
    null;

  exitPointerLock(): void {
    throw new Error();
  }
}
