import { UnImplemented } from "./utils.ts";
import { type IDocumentOrShadowRoot } from "../interface.d.ts";

export class DocumentOrShadowRoot implements IDocumentOrShadowRoot {
  activeElement: any | null;

  adoptedStyleSheets: any[] = [];

  fullscreenElement: any | null;

  pictureInPictureElement: any | null;

  pointerLockElement: any | null;

  styleSheets: any;

  elementFromPoint(x: number, y: number): any | null {
    throw new UnImplemented();
  }

  elementsFromPoint(x: number, y: number): any[] {
    throw new UnImplemented();
  }

  getAnimations(): any[] {
    throw new UnImplemented();
  }
}
