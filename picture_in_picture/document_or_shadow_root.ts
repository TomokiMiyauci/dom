interface IDocumentOrShadowRoot_Picture_In_Picture
  extends Pick<DocumentOrShadowRoot, "pictureInPictureElement"> {}

export class DocumentOrShadowRoot
  implements IDocumentOrShadowRoot_Picture_In_Picture {
  get pictureInPictureElement(): Element | null {
    throw new Error("pictureInPictureElement");
  }
}
