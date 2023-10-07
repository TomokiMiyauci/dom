import { NonDocumentTypeChildNode } from "../nodes/node_trees/non_document_type_child_node.ts";
import { Element } from "../nodes/elements/element.ts";
import { CharacterData } from "../nodes/character_data.ts";
import { INonDocumentTypeChildNode } from "../../interface.d.ts";
import { includes } from "../../utils.ts";

declare module "../nodes/elements/element.ts" {
  interface Element extends INonDocumentTypeChildNode {}
}

declare module "../nodes/character_data.ts" {
  interface CharacterData extends INonDocumentTypeChildNode {}
}

includes(Element, NonDocumentTypeChildNode);
includes(CharacterData, NonDocumentTypeChildNode);
