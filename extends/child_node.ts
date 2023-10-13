import { CharacterData } from "../nodes/character_data.ts";
import { Element } from "../nodes/element.ts";
import { DocumentType } from "../nodes/document_type.ts";
import { IChildNode } from "../interface.d.ts";
import { ChildNode } from "../nodes/mixins/child_node.ts";
import { includes } from "../utils.ts";

declare module "../nodes/character_data.ts" {
  interface CharacterData extends IChildNode {}
}

declare module "../nodes/element.ts" {
  interface Element extends IChildNode {}
}

declare module "../nodes/document_type.ts" {
  interface DocumentType extends IChildNode {}
}

includes(DocumentType, ChildNode);
includes(CharacterData, ChildNode);
includes(Element, ChildNode);
