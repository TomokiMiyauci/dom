import { NonElementParentNode } from "../nodes/non_element_parent_node.ts";
import { Document } from "../nodes/document.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { INonElementParentNode } from "../interface.d.ts";
import { includes } from "../utils.ts";

declare module "../nodes/document.ts" {
  interface Document extends INonElementParentNode {}
}

declare module "../nodes/document_fragment.ts" {
  interface DocumentFragment extends INonElementParentNode {}
}

includes(Document, NonElementParentNode);
includes(DocumentFragment, NonElementParentNode);
