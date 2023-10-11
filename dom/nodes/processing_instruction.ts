import type { IProcessingInstruction } from "../../interface.d.ts";
import { CharacterData } from "./character_data.ts";
import { NodeType } from "./node.ts";
import { Document } from "./documents/document.ts";
import { $, internalSlots } from "../../internal.ts";
import { Exposed } from "../../_internals/webidl/extended_attribute.ts";

@Exposed("Window", "ProcessingInstruction")
export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction {
  constructor() {
    super();

    internalSlots.extends<ProcessingInstruction>(
      this,
      new ProcessingInstructionInternals(),
    );
  }

  override readonly nodeType: NodeType.PROCESSING_INSTRUCTION_NODE =
    NodeType.PROCESSING_INSTRUCTION_NODE;

  override get nodeName(): string {
    return this.#_.target;
  }

  get target(): string {
    return this.#_.target;
  }

  protected override clone(document: Document): ProcessingInstruction {
    const node = new ProcessingInstruction();
    $(node).nodeDocument = document,
      $(node).target = this.#_.target,
      $(node).data = this.#_.data;

    return node;
  }

  get #_() {
    return internalSlots.get<ProcessingInstruction>(this);
  }
}

export class ProcessingInstructionInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-pi-target)
   */
  target!: string;
}
