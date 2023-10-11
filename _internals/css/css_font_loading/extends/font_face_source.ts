import { FontFaceSource } from "../font_face_source.ts";
import { Document } from "../../../../dom/nodes/documents/document.ts";
import { includes } from "../../../../utils.ts";

declare module "../../../../dom/nodes/documents/document.ts" {
  interface Document extends FontFaceSource {}
}

includes(Document, FontFaceSource);
