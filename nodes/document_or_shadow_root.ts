import { UnImplemented } from "./utils.ts";
import { type IDocumentOrShadowRoot } from "../interface.d.ts";
import { Constructor } from "../deps.ts";

export function DocumentOrShadowRoot<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocumentOrShadowRoot {
    get activeElement(): Element | null {
      throw new UnImplemented("activeElement");
    }

    get adoptedStyleSheets(): CSSStyleSheet[] {
      throw new UnImplemented("adoptedStyleSheets");
    }

    set adoptedStyleSheets(value: CSSStyleSheet[]) {
      throw new UnImplemented("adoptedStyleSheets");
    }

    get fullscreenElement(): Element | null {
      throw new UnImplemented("fullscreenElement");
    }

    get pictureInPictureElement(): Element | null {
      throw new UnImplemented("pictureInPictureElement");
    }

    get pointerLockElement(): Element | null {
      throw new UnImplemented("pointerLockElement");
    }

    get styleSheets(): StyleSheetList {
      throw new UnImplemented("styleSheets");
    }

    elementFromPoint(x: number, y: number): any | null {
      throw new UnImplemented("elementFromPoint");
    }

    elementsFromPoint(x: number, y: number): any[] {
      throw new UnImplemented("elementsFromPoint");
    }

    getAnimations(): any[] {
      throw new UnImplemented("getAnimations");
    }
  }

  return Mixin;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot extends IDocumentOrShadowRoot {}
