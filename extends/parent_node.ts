import { Element } from "../nodes/elements/element.ts";
import { Document } from "../nodes/documents/document.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { IParentNode } from "../interface.d.ts";
import { ParentNode } from "../nodes/node_trees/parent_node.ts";
import { includes } from "../utils.ts";

declare module "../nodes/document_fragment.ts" {
  interface DocumentFragment extends IParentNode {}
}

declare module "../nodes/documents/document.ts" {
  interface Document extends IParentNode {}
}

declare module "../nodes/elements/element.ts" {
  interface Element extends IParentNode {}
}

includes(Document, ParentNode);
includes(DocumentFragment, ParentNode);
includes(Element, ParentNode);
