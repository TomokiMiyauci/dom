import type { IProcessingInstruction } from "../../interface.d.ts";
import { CharacterData, CharacterDataStates } from "./character_data.ts";
import { LinkStyle } from "../../cssom/link_style.ts";
import { NodeStates, NodeType } from "./node.ts";
import { Document } from "./documents/document.ts";
import { $target } from "./internal.ts";

export interface ProcessingInstructionInits {
  target: string;
}

@LinkStyle
export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction {
  readonly [$target]: string;

  constructor(
    { data, nodeDocument, target }:
      & ProcessingInstructionInits
      & CharacterDataStates
      & NodeStates,
  ) {
    super(data, nodeDocument);
    this[$target] = target;
  }

  override readonly nodeType: NodeType.PROCESSING_INSTRUCTION_NODE =
    NodeType.PROCESSING_INSTRUCTION_NODE;

  override get nodeName(): string {
    return this[$target];
  }

  get target(): string {
    return this[$target];
  }

  protected override clone(document: Document): ProcessingInstruction {
    return new ProcessingInstruction({
      data: this._data,
      target: this[$target],
      nodeDocument: document,
    });
  }
}

// deno-lint-ignore no-empty-interface
export interface ProcessingInstruction extends LinkStyle {}
