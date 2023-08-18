import { type Constructor } from "../deps.ts";

interface IDocument_Picture_In_Picture extends
  Pick<
    Document,
    "pictureInPictureEnabled" | "exitPictureInPicture"
  > {}

export function Document_Picture_In_Picture<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocument_Picture_In_Picture {
    get pictureInPictureEnabled(): boolean {
      throw new Error();
    }

    exitPictureInPicture(): Promise<void> {
      throw new Error();
    }
  }

  return Mixin;
}

export interface Document_Picture_In_Picture
  extends IDocument_Picture_In_Picture {}
