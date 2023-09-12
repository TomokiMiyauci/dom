import type { IProcessingInstruction } from "../../interface.d.ts";
import { CharacterData, CharacterDataInternals } from "./character_data.ts";
import { LinkStyle } from "../../cssom/link_style.ts";
import { NodeType } from "./node.ts";
import { Document } from "./documents/document.ts";
import { internalSlots } from "../../internal.ts";

@LinkStyle
export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction {
  constructor(
    { data, nodeDocument, target }: Pick<
      ProcessingInstructionInternals,
      "data" | "nodeDocument" | "target"
    >,
  ) {
    super(data, nodeDocument);

    internalSlots.set(
      this,
      new ProcessingInstructionInternals({
        data,
        nodeDocument,
        target,
      }),
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

  get #_(): ProcessingInstructionInternals {
    return internalSlots.get(this);
  }
}

// deno-lint-ignore no-empty-interface
export interface ProcessingInstruction extends LinkStyle {}

export class ProcessingInstructionInternals extends CharacterDataInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-pi-target)
   */
  target: string;

  constructor(
    { target, nodeDocument, data }: Pick<
      ProcessingInstructionInternals,
      "target" | "data" | "nodeDocument"
    >,
  ) {
    super({ data, nodeDocument });

    this.target = target;
  }
}
