import { Element } from "../nodes/element.ts";
import { Document } from "../nodes/document.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { IParentNode } from "../interface.d.ts";
import { ParentNode } from "../nodes/parent_node.ts";
import { includes } from "../utils.ts";

declare module "../nodes/document_fragment.ts" {
  interface DocumentFragment extends IParentNode {}
}

declare module "../nodes/document.ts" {
  interface Document extends IParentNode {}
}

declare module "../nodes/element.ts" {
  interface Element extends IParentNode {}
}

includes(Document, ParentNode);
includes(DocumentFragment, ParentNode);
includes(Element, ParentNode);
