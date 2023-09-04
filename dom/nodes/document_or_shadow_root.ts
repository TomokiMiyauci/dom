import { UnImplemented } from "./utils.ts";
import { type IDocumentOrShadowRoot } from "../../interface.d.ts";
import { Constructor } from "../../deps.ts";
import { DocumentOrShadowRoot_Picture_In_Picture } from "../../picture_in_picture/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_HTML } from "../../html/dom/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_CSSOM } from "../../cssom/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_Fullscreen } from "../../fullscreen/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_Pointerlock } from "../../pointerlock/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_WebAnimations } from "../../web_animations/document_or_shadow_root.ts";

export function DocumentOrShadowRoot<T extends Constructor>(Ctor: T) {
  @DocumentOrShadowRoot_Picture_In_Picture
  @DocumentOrShadowRoot_HTML
  @DocumentOrShadowRoot_CSSOM
  @DocumentOrShadowRoot_Fullscreen
  @DocumentOrShadowRoot_Pointerlock
  @DocumentOrShadowRoot_WebAnimations
  abstract class Mixin extends Ctor implements IDocumentOrShadowRoot {
    elementFromPoint(x: number, y: number): any | null {
      throw new UnImplemented("elementFromPoint");
    }

    elementsFromPoint(x: number, y: number): any[] {
      throw new UnImplemented("elementsFromPoint");
    }
  }

  interface Mixin
    extends
      DocumentOrShadowRoot_Picture_In_Picture,
      DocumentOrShadowRoot_HTML,
      DocumentOrShadowRoot_CSSOM,
      DocumentOrShadowRoot_Fullscreen,
      DocumentOrShadowRoot_Pointerlock,
      DocumentOrShadowRoot_WebAnimations {}

  return Mixin;
}

// deno-lint-ignore no-empty-interface
export interface DocumentOrShadowRoot extends IDocumentOrShadowRoot {}
