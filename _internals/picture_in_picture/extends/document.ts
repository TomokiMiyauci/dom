import * as PictureInPicture from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends PictureInPicture.Document {}
}

includes(DOM.Document, PictureInPicture.Document);
