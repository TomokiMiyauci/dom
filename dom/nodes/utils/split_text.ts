import { substringData } from "../character_data.ts";
import { replaceData } from "../character_data_algorithm.ts";
import { insertNode } from "../node_trees/mutation.ts";
import { nodeLength } from "../node_trees/node_tree.ts";
import { isNotNull } from "../../../deps.ts";
import { DOMExceptionName } from "../../../webidl/exception.ts";
import { $, tree } from "../../../internal.ts";
import { Text } from "../text.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-text-split
 */
export function splitText(
  node: globalThis.Text,
  offset: number,
): globalThis.Text {
  // 1 Let length be node’s length.
  const length = nodeLength(node);

  // 2 If offset is greater than length, then throw an "IndexSizeError" DOMException.
  // TODO
  if (offset > length) {
    throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
  }

  // 3 Let count be length minus offset.
  const count = length - offset;

  // 4 Let new data be the result of substringing data with node node, offset offset, and count count.
  const newData = substringData(node, offset, count);

  // 5 Let new node be a new Text node, with the same node document as node. Set new node’s data to new data.
  const newNode = Text["create"]({
    data: newData,
    nodeDocument: $(node).nodeDocument,
  });

  // 6 Let parent be node’s parent.
  const parent = tree.parent(node);

  // 7 If parent is not null, then:
  if (isNotNull(parent)) {
    // 1 Insert new node into parent before node’s next sibling.
    insertNode(newNode, parent, tree.nextSibling(node));

    // 2 For each live range whose start node is node and start offset is greater than offset, set its start node to new node and decrease its start offset by offset.

    // 3 For each live range whose end node is node and end offset is greater than offset, set its end node to new node and decrease its end offset by offset.

    // 4 For each live range whose start node is parent and start offset is equal to the index of node plus 1, increase its start offset by 1.

    // 5 For each live range whose end node is parent and end offset is equal to the index of node plus 1, increase its end offset by 1.
  }

  // 8 Replace data with node node, offset offset, count count, and data the empty string.
  replaceData(node, offset, count, "");

  // 9 Return new node.
  return newNode;
}
