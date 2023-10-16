import type { IProcessingInstruction } from "../interface.d.ts";
import { CharacterData } from "./character_data.ts";
import { NodeType } from "./node.ts";
import { Document } from "./document.ts";
import { $, internalSlots } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { data, target } from "../symbol.ts";
import type { ProcessingInstructionInternals } from "../i.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#processinginstruction)
 */
@Exposed("Window", "ProcessingInstruction")
export class ProcessingInstruction extends CharacterData
  implements IProcessingInstruction, ProcessingInstructionInternals {
  protected constructor() {
    super();
  }

  override readonly nodeType: NodeType.PROCESSING_INSTRUCTION_NODE =
    NodeType.PROCESSING_INSTRUCTION_NODE;

  override get nodeName(): string {
    return this[target];
  }

  get target(): string {
    return this[target];
  }

  protected override clone(document: Document): ProcessingInstruction {
    const node = new ProcessingInstruction();
    $(node).nodeDocument = document,
      node[target] = this[target],
      node[data] = this[data];

    return node;
  }

  get #_() {
    return internalSlots.get<ProcessingInstruction>(this);
  }

  /**
   * @remarks Set after creation
   */
  [data]!: string;
  /**
   * @remarks Set after creation
   */
  [target]!: string;
}
