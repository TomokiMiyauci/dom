import { replaceData, substringData } from "./character_data.ts";
import {
  compareRangeOffset,
  equalsNodeEndNode,
  equalsNodeStartNode,
  insertNode,
  Operator,
} from "./mutation.ts";
import { nodeLength } from "./node_tree.ts";
import { isNotNull, iter } from "../../deps.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { $, tree } from "../../internal.ts";
import { Text } from "../text.ts";
import type { $Text } from "../../i.ts";
import { data, nodeDocument } from "../../symbol.ts";
import * as $$ from "../../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-text-split
 */
export function splitText(node: $Text, offset: number): Text {
  // 1 Let length be node’s length.
  const length = nodeLength(node);

  // 2 If offset is greater than length, then throw an "IndexSizeError" DOMException.
  if (offset > length) {
    throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
  }

  // 3 Let count be length minus offset.
  const count = length - offset;

  // 4 Let new data be the result of substringing data with node node, offset offset, and count count.
  const newData = substringData(node, offset, count);

  const newNode = new Text();
  // 5 Let new node be a new Text node, with the same node document as node. Set new node’s data to new data.
  newNode[data] = newData, newNode[nodeDocument] = node[nodeDocument];

  // 6 Let parent be node’s parent.
  const parent = tree.parent(node);

  // 7 If parent is not null, then:
  if (isNotNull(parent)) {
    // 1 Insert new node into parent before node’s next sibling.
    insertNode(newNode, parent, tree.nextSibling(node));

    const _ranges = node[nodeDocument][$$.ranges];
    const ranges = iter(_ranges);
    const startNodeIsNode = equalsNodeStartNode.bind(null, node);
    const startOffsetIsGtOffset = compareRangeOffset.bind(
      null,
      Operator.Gt,
      offset,
      true,
    );

    // 2 For each live range whose start node is node and start offset is greater than offset, set its start node to new node and decrease its start offset by offset.
    for (
      const range of ranges.filter(startNodeIsNode).filter(
        startOffsetIsGtOffset,
      )
    ) range[$$.start][0] = newNode, range[$$.start][1] -= offset;

    const endNodeIsNode = equalsNodeEndNode.bind(null, node);
    const endOffsetIsGtOffset = compareRangeOffset.bind(
      null,
      Operator.Gt,
      offset,
      false,
    );

    // 3 For each live range whose end node is node and end offset is greater than offset, set its end node to new node and decrease its end offset by offset.
    for (
      const range of ranges.filter(endNodeIsNode).filter(endOffsetIsGtOffset)
    ) range[$$.end][0] = newNode, range[$$.end][1] -= offset;

    const startNodeIsParent = equalsNodeStartNode.bind(null, parent);
    const indexOfNodePlus1 = tree.index(node) + 1;
    const startOffsetIsEqIndexOfNodePlus1 = compareRangeOffset.bind(
      null,
      Operator.Eq,
      indexOfNodePlus1,
      true,
    );

    // 4 For each live range whose start node is parent and start offset is equal to the index of node plus 1, increase its start offset by 1.
    for (
      const range of ranges.filter(startNodeIsParent).filter(
        startOffsetIsEqIndexOfNodePlus1,
      )
    ) range[$$.start][1]++;

    const endNodeIsParent = equalsNodeEndNode.bind(null, parent);
    const endOffsetIsEqIndexOfNodePlus1 = compareRangeOffset.bind(
      null,
      Operator.Eq,
      indexOfNodePlus1,
      false,
    );

    // 5 For each live range whose end node is parent and end offset is equal to the index of node plus 1, increase its end offset by 1.
    for (
      const range of ranges.filter(endNodeIsParent).filter(
        endOffsetIsEqIndexOfNodePlus1,
      )
    ) range[$$.end][1]++;
  }

  // 8 Replace data with node node, offset offset, count count, and data the empty string.
  replaceData(node, offset, count, "");

  // 9 Return new node.
  return newNode;
}
