import { FontFaceSource } from "../font_face_source.ts";
import { Document } from "../../../../nodes/document.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../nodes/document.ts" {
  interface Document extends FontFaceSource {}
}

includes(Document, FontFaceSource);
