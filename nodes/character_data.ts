import { Node } from "./node.ts";
import { ChildNode } from "./child_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { UnImplemented } from "./utils.ts";
import { type ICharacterData } from "../interface.d.ts";

export abstract class CharacterData extends Node implements ICharacterData {
  abstract data: string;

  get length(): number {
    throw new UnImplemented();
  }

  appendData(data: string): void {
    throw new UnImplemented();
  }

  deleteData(offset: number, count: number): void {
    throw new UnImplemented();
  }

  insertData(offset: number, data: string): void {
    throw new UnImplemented();
  }

  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new UnImplemented();
  }

  replaceData(offset: number, count: number, data: string): void {
    throw new UnImplemented();
  }

  substringData(offset: number, count: number): string {
    throw new UnImplemented();
  }
}

export interface CharacterData extends ChildNode, NonDocumentTypeChildNode {}
