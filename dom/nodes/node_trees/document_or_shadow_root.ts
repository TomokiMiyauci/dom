import { UnImplemented } from "../utils.ts";
import { type IDocumentOrShadowRoot } from "../../../interface.d.ts";
import { DocumentOrShadowRoot_Picture_In_Picture } from "../../../picture_in_picture/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_HTML } from "../../../html/dom/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_CSSOM } from "../../../cssom/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_Fullscreen } from "../../../fullscreen/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_Pointerlock } from "../../../pointerlock/document_or_shadow_root.ts";
import { DocumentOrShadowRoot_WebAnimations } from "../../../web_animations/document_or_shadow_root.ts";

@DocumentOrShadowRoot_Picture_In_Picture
@DocumentOrShadowRoot_HTML
@DocumentOrShadowRoot_CSSOM
@DocumentOrShadowRoot_Fullscreen
@DocumentOrShadowRoot_Pointerlock
@DocumentOrShadowRoot_WebAnimations
export class DocumentOrShadowRoot implements IDocumentOrShadowRoot {
  elementFromPoint(x: number, y: number): any | null {
    throw new UnImplemented("elementFromPoint");
  }

  elementsFromPoint(x: number, y: number): any[] {
    throw new UnImplemented("elementsFromPoint");
  }
}

export interface DocumentOrShadowRoot
  extends
    DocumentOrShadowRoot_Picture_In_Picture,
    DocumentOrShadowRoot_HTML,
    DocumentOrShadowRoot_CSSOM,
    DocumentOrShadowRoot_Fullscreen,
    DocumentOrShadowRoot_Pointerlock,
    DocumentOrShadowRoot_WebAnimations {}
