import { NonDocumentTypeChildNode } from "../nodes/mixins/non_document_type_child_node.ts";
import { Element } from "../nodes/element.ts";
import { CharacterData } from "../nodes/character_data.ts";
import { INonDocumentTypeChildNode } from "../interface.d.ts";
import { includes } from "../utils.ts";

declare module "../nodes/element.ts" {
  interface Element extends INonDocumentTypeChildNode {}
}

declare module "../nodes/character_data.ts" {
  interface CharacterData extends INonDocumentTypeChildNode {}
}

includes(Element, NonDocumentTypeChildNode);
includes(CharacterData, NonDocumentTypeChildNode);
