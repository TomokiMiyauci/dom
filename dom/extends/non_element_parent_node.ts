import { NonElementParentNode } from "../nodes/node_trees/non_element_parent_node.ts";
import { Document } from "../nodes/documents/document.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { INonElementParentNode } from "../../interface.d.ts";
import { includes } from "../../utils.ts";

declare module "../nodes/documents/document.ts" {
  interface Document extends INonElementParentNode {}
}

declare module "../nodes/document_fragment.ts" {
  interface DocumentFragment extends INonElementParentNode {}
}

includes(Document, NonElementParentNode);
includes(DocumentFragment, NonElementParentNode);
