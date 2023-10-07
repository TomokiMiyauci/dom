interface IDocument_Picture_In_Picture extends
  Pick<
    Document,
    "pictureInPictureEnabled" | "exitPictureInPicture"
  > {}

export class Document implements IDocument_Picture_In_Picture {
  get pictureInPictureEnabled(): boolean {
    throw new Error();
  }

  exitPictureInPicture(): Promise<void> {
    throw new Error();
  }
}
