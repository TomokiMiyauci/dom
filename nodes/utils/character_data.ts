/** {@linkcode CharacterData} shared algorithms.
 * @module
 */

import { queueMutationRecord } from "../queue.ts";
import { OrderedSet } from "../../_internals/infra/data_structures/set.ts";
import { nodeLength } from "../node_tree.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { $, tree } from "../../internal.ts";
import { iter } from "../../deps.ts";
import {
  compareRangeOffset,
  equalsNodeEndNode,
  equalsNodeStartNode,
  Operator,
} from "../mutation.ts";

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
    $(node).data,
    new OrderedSet(),
    new OrderedSet(),
    null,
    null,
  );

  // 5 Insert data into node’s data after offset code units.
  $(node).data = $(node).data.substring(0, offset) + data +
    $(node).data.substring(offset + count);

  // 6 Let delete offset be offset + data’s length.
  // const deleteOffset = offset + $(node).data.length;

  // 7 Starting from delete offset code units, remove count code units from node’s data.

  const { nodeDocument } = $(node);
  const { ranges: _ranges } = $(nodeDocument);
  const ranges = iter(_ranges);
  const startNodeIsNode = equalsNodeStartNode.bind(null, node);
  const startOffsetIsGtOffset = compareRangeOffset.bind(
    null,
    Operator.Gt,
    offset,
    true,
  );
  const offsetPlusCount = offset + count;
  const startOffsetLteOffsetPlusCount = compareRangeOffset.bind(
    null,
    Operator.Lte,
    offsetPlusCount,
    true,
  );
  const startNodeIsNodeRanges = ranges.filter(startNodeIsNode);

  // 8 For each live range whose start node is node and start offset is greater than offset but less than or equal to offset plus count,
  for (
    const range of startNodeIsNodeRanges.filter(startOffsetIsGtOffset)
      .filter(startOffsetLteOffsetPlusCount)
    // set its start offset to offset.
  ) $(range).start[1] = offset;

  const endNodeIsNode = equalsNodeEndNode.bind(null, node);
  const endOffsetIsGtOffset = compareRangeOffset.bind(
    null,
    Operator.Gt,
    offset,
    false,
  );
  const endOffsetLteOffsetPlusCount = compareRangeOffset.bind(
    null,
    Operator.Lte,
    offsetPlusCount,
    false,
  );
  const endNodeIsNodeRanges = ranges.filter(endNodeIsNode);

  // 9 For each live range whose end node is node and end offset is greater than offset but less than or equal to offset plus count,
  for (
    const range of endNodeIsNodeRanges.filter(endOffsetIsGtOffset).filter(
      endOffsetLteOffsetPlusCount,
    )
    // set its end offset to offset.
  ) $(range).end[1] = offset;

  const diff = data.length - count;
  const startOffsetIsGtOffsetPlusCount = compareRangeOffset.bind(
    null,
    Operator.Gt,
    offsetPlusCount,
    true,
  );

  // 10 For each live range whose start node is node and start offset is greater than offset plus count,
  for (
    const range of startNodeIsNodeRanges.filter(startOffsetIsGtOffsetPlusCount)
    // increase its start offset by data’s length and decrease it by count.
  ) $(range).start[1] += diff;

  const endOffsetIsGtOffsetPlusCount = compareRangeOffset.bind(
    null,
    Operator.Gt,
    offsetPlusCount,
    false,
  );

  // 11 For each live range whose end node is node and end offset is greater than offset plus count,
  for (
    const range of endNodeIsNodeRanges.filter(endOffsetIsGtOffsetPlusCount)
    // increase its end offset by data’s length and decrease it by count.
  ) $(range).end[1] += diff;

  const parent = tree.parent(node);
  // 12 If node’s parent is non-null, then run the children changed steps for node’s parent.
  if (parent) $(parent).childrenChangedSteps.run();
}

/**
 * @see https://dom.spec.whatwg.org/#concept-cd-substring
 * @throws {DOMException}
 */
export function substringData(
  node: CharacterData,
  offset: number,
  count: number,
): string {
  // 1. Let length be node’s length.
  const length = nodeLength(node);

  // 2. If offset is greater than length, then throw an "IndexSizeError" DOMException.
  if (offset < 0 || offset > length) { // offset < 0 is test requirement
    throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
  }

  // 3. If offset plus count is greater than length, return a string whose value is the code units from the offsetth code unit to the end of node’s data, and then return.
  if (offset + count > length) return $(node).data.slice(offset);

  // 4. Return a string whose value is the code units from the offsetth code unit to the offset+countth code unit in node’s data.
  return $(node).data.slice(offset, offset + count);
}
