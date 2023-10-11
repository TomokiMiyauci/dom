import { FontFaceSource } from "../font_face_source.ts";
import { Document } from "../../../../nodes/documents/document.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../nodes/documents/document.ts" {
  interface Document extends FontFaceSource {}
}

includes(Document, FontFaceSource);
