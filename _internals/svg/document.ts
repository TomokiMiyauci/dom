interface IDocument_SVG extends Pick<Document, "rootElement"> {}

export class Document implements IDocument_SVG {
  get rootElement(): SVGSVGElement | null {
    throw new Error("rootElement#getter");
  }
}
