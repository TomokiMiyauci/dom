type Member =
  | "fgColor"
  | "linkColor"
  | "vlinkColor"
  | "alinkColor"
  | "bgColor"
  | "anchors"
  | "applets"
  | "clear"
  | "captureEvents"
  | "releaseEvents"
  | "all";

export interface IDocument_Obsolete extends Pick<Document, Member> {}

export class Document implements IDocument_Obsolete {
  get fgColor(): string {
    throw new Error("fgColor#getter");
  }

  set fgColor(value: string) {
    throw new Error("fgColor#setter");
  }

  get linkColor(): string {
    throw new Error();
  }

  set linkColor(value: string) {
    throw new Error();
  }

  get vlinkColor(): string {
    throw new Error();
  }

  set vlinkColor(value: string) {
    throw new Error();
  }

  get alinkColor(): string {
    throw new Error();
  }

  set alinkColor(value: string) {
    throw new Error();
  }

  get bgColor(): string {
    throw new Error();
  }

  set bgColor(value: string) {
    throw new Error();
  }

  get anchors(): HTMLCollectionOf<HTMLAnchorElement> {
    throw new Error();
  }

  get applets(): HTMLCollection {
    throw new Error();
  }

  clear(): void {
    throw new Error();
  }

  captureEvents(): void {
    throw new Error();
  }

  releaseEvents(): void {
    throw new Error();
  }

  get all(): HTMLAllCollection {
    throw new Error();
  }
}
