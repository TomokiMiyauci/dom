import type { IMutationRecord } from "../../../interface.d.ts";
import { Exposed } from "../../../_internals/webidl/extended_attribute.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#mutationrecord)
 */
@Exposed("Window", "MutationRecord")
export class MutationRecord implements IMutationRecord {
  constructor(
    readonly type: MutationRecordType,
    readonly target: Node,
    readonly attributeName: string | null,
    readonly attributeNamespace: string | null,
    readonly oldValue: string | null,
    readonly addedNodes: NodeList,
    readonly removedNodes: NodeList,
    readonly previousSibling: Node | null,
    readonly nextSibling: Node | null,
  ) {}
}
