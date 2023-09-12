import type { IProcessingInstruction } from "../../interface.d.ts";
import {
  CharacterData,
  CharacterDataInternals,
  CharacterDataStates,
} from "./character_data.ts";
import { LinkStyle } from "../../cssom/link_style.ts";
import { NodeStates, NodeType } from "./node.ts";
import { Document } from "./documents/document.ts";
import { internalSlots } from "../../internal.ts";

@LinkStyle
export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction {
  constructor(
    { data, nodeDocument, target }:
      & ProcessingInstructionInternals
      & CharacterDataStates
      & NodeStates,
  ) {
    super(data, nodeDocument);

    const _: ProcessingInstructionInternals = { data, target };
    internalSlots.set(this, _);
    this._ = _;
  }

  override readonly nodeType: NodeType.PROCESSING_INSTRUCTION_NODE =
    NodeType.PROCESSING_INSTRUCTION_NODE;

  override get nodeName(): string {
    return this._.target;
  }

  get target(): string {
    return this._.target;
  }

  protected override clone(document: Document): ProcessingInstruction {
    return new ProcessingInstruction({
      data: this._.data,
      target: this._.target,
      nodeDocument: document,
    });
  }

  protected override _: ProcessingInstructionInternals;
}

// deno-lint-ignore no-empty-interface
export interface ProcessingInstruction extends LinkStyle {}

export interface ProcessingInstructionInternals extends CharacterDataInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-pi-target)
   */
  target: string;
}
