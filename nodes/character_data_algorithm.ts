/** {@linkcode CharacterData} shared algorithms.
 * @module
 */

import { queueMutationRecord } from "./mutation_observer.ts";
import { OrderedSet } from "../infra/data_structures/set.ts";
import { nodeLength } from "./node_tree.ts";
import type { CharacterData } from "./character_data.ts";
import { DOMExceptionName } from "../webidl/exception.ts";
import { $data } from "./internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-cd-replace
 * @throws {DOMException}
 */
export function replaceData(
  node: CharacterData,
  offset: number,
  count: number,
  data: string,
) {
  // 1 Let length be node’s length.
  const length = nodeLength(node);

  // 2 If offset is greater than length, then throw an "IndexSizeError" DOMException.
  if (offset < 0 || offset > length) { // offset < 0 is test requirement
    throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
  }

  // 3 If offset plus count is greater than length, then set count to length minus offset.
  if (offset + count > length) count = length - offset;

  // 4 Queue a mutation record of "characterData" for node with null, null, node’s data, « », « », null, and null.
  queueMutationRecord(
    "characterData",
    node,
    null,
    null,
    node[$data],
    new OrderedSet(),
    new OrderedSet(),
    null,
    null,
  );

  // 5 Insert data into node’s data after offset code units.
  node[$data] = node[$data].substring(0, offset) + data +
    node[$data].substring(offset + count);

  // 6 Let delete offset be offset + data’s length.
  const deleteOffset = offset + node[$data].length;

  // 7 Starting from delete offset code units, remove count code units from node’s data.

  // 8 For each live range whose start node is node and start offset is greater than offset but less than or equal to offset plus count, set its start offset to offset.

  // 9 For each live range whose end node is node and end offset is greater than offset but less than or equal to offset plus count, set its end offset to offset.

  // 10 For each live range whose start node is node and start offset is greater than offset plus count, increase its start offset by data’s length and decrease it by count.

  // 11 For each live range whose end node is node and end offset is greater than offset plus count, increase its end offset by data’s length and decrease it by count.

  // 12 If node’s parent is non-null, then run the children changed steps for node’s parent.
}
