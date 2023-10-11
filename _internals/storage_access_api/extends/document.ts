import * as StorageAccessAPI from "../document.ts";
import * as DOM from "../../../nodes/document.ts";
import { includes } from "../../../utils.ts";

declare module "../../../nodes/document.ts" {
  interface Document extends StorageAccessAPI.Document {}
}

includes(DOM.Document, StorageAccessAPI.Document);
