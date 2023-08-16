import { UnImplemented } from "./utils.ts";
import { type IDocumentOrShadowRoot } from "../interface.d.ts";
import { Constructor } from "../deps.ts";

export function DocumentOrShadowRoot<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements IDocumentOrShadowRoot {
    get activeElement(): Element | null {
      throw new UnImplemented();
    }

    get adoptedStyleSheets(): CSSStyleSheet[] {
      throw new UnImplemented();
    }

    set adoptedStyleSheets(value: CSSStyleSheet[]) {
      throw new UnImplemented();
    }

    get fullscreenElement(): Element | null {
      throw new UnImplemented();
    }

    get pictureInPictureElement(): Element | null {
      throw new UnImplemented();
    }

    get pointerLockElement(): Element | null {
      throw new UnImplemented();
    }

    get styleSheets(): StyleSheetList {
      throw new UnImplemented();
    }

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

  return Mixin;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot extends IDocumentOrShadowRoot {}
