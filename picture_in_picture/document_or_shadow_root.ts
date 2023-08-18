import { type Constructor } from "../deps.ts";

interface IDocumentOrShadowRoot_Picture_In_Picture extends
  Pick<
    DocumentOrShadowRoot,
    "pictureInPictureElement"
  > {}

export function DocumentOrShadowRoot_Picture_In_Picture<T extends Constructor>(
  Ctor: T,
) {
  abstract class Mixin extends Ctor
    implements IDocumentOrShadowRoot_Picture_In_Picture {
    get pictureInPictureElement(): Element | null {
      throw new Error("pictureInPictureElement");
    }
  }

  return Mixin;
}

export interface DocumentOrShadowRoot_Picture_In_Picture
  extends IDocumentOrShadowRoot_Picture_In_Picture {}
