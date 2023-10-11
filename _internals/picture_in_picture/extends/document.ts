import * as PictureInPicture from "../document.ts";
import * as DOM from "../../../nodes/documents/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/documents/document.ts" {
  interface Document extends PictureInPicture.Document {}
}

includes(DOM.Document, PictureInPicture.Document);
