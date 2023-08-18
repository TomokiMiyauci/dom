import { UnImplemented } from "./utils.ts";
import { type IDocumentOrShadowRoot } from "../interface.d.ts";
import { Constructor } from "../deps.ts";
import { DocumentOrShadowRoot_Picture_In_Picture } from "../picture_in_picture/document_or_shadow_root.ts";

export function DocumentOrShadowRoot<T extends Constructor>(Ctor: T) {
  @DocumentOrShadowRoot_Picture_In_Picture
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

  // deno-lint-ignore no-empty-interface
  interface Mixin extends DocumentOrShadowRoot_Picture_In_Picture {}

  return Mixin;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot extends IDocumentOrShadowRoot {}
