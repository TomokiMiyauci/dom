import { Node, NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { UnImplemented } from "./utils.ts";
import { Slottable } from "./slottable.ts";
import type { IText } from "../interface.d.ts";

export class Text extends CharacterData implements IText {
  constructor(public data: string) {
    super();
  }

  override get nodeType(): NodeType.TEXT_NODE {
    return NodeType.TEXT_NODE;
  }

  override get nodeName(): string {
    throw new UnImplemented();
  }

  override get nodeValue(): string | null {
    throw new UnImplemented();
  }
  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  override get textContent(): string | null {
    throw new UnImplemented();
  }
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  get wholeText(): string {
    throw new UnImplemented();
  }

  splitText(offset: number): any {
    throw new UnImplemented();
  }
}

export interface Text extends Slottable {}
