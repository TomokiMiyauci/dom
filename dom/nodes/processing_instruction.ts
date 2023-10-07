import type { IProcessingInstruction } from "../../interface.d.ts";
import { CharacterData } from "./character_data.ts";
import { NodeType } from "./node.ts";
import { Document } from "./documents/document.ts";
import { internalSlots } from "../../internal.ts";

export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction {
  constructor(
    { data, target, nodeDocument }: {
      data: string;
      target: string;
      nodeDocument: Document;
    },
  ) {
    super(data, nodeDocument);

    internalSlots.extends<ProcessingInstruction>(
      this,
      new ProcessingInstructionInternals(target),
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
    return new ProcessingInstruction({
      data: this.#_.data,
      target: this.#_.target,
      nodeDocument: document,
    });
  }

  get #_() {
    return internalSlots.get<ProcessingInstruction>(this);
  }
}

export class ProcessingInstructionInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-pi-target)
   */
  target: string;

  constructor(target: string) {
    this.target = target;
  }
}
