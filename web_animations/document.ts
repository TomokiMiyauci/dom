interface IDocument_WebAnimation extends Pick<Document, "timeline"> {}

export class Document implements IDocument_WebAnimation {
  get timeline(): DocumentTimeline {
    throw new Error();
  }
}
