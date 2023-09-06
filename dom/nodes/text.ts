import { type Node, type NodeStates, NodeType } from "./node.ts";
import { type Document } from "./documents/document.ts";
import {
  CharacterData,
  type CharacterDataStates,
  substringData,
} from "./character_data.ts";
import { replaceData } from "./character_data_algorithm.ts";
import { isText } from "./utils.ts";
import { Slottable } from "./node_trees/slottable.ts";
import { List } from "../../infra/data_structures/list.ts";
import { insertNode } from "./node_trees/mutation.ts";
import type { IText } from "../../interface.d.ts";
import { nodeLength } from "./node_trees/node_tree.ts";
import {
  getDescendants,
  getFollowingSiblings,
  getNextSibling,
  getPrecedingSiblings,
  orderTreeChildren,
} from "../infra/tree.ts";
import { $create, $nodeDocument } from "./internal.ts";
import { ifilter, imap, isNotNull, takewhile } from "../../deps.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { concatString } from "../../infra/string.ts";

@Slottable
export class Text extends CharacterData implements IText {
  static [$create](
    { data, nodeDocument }: CharacterDataStates & NodeStates,
  ): Text {
    const node = new Text(data);

    node[$nodeDocument] = nodeDocument;

    return node;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-text
   */
  constructor(data: string = "") {
    // Current Restrictions: parameter decorator alone cannot override arguments
    data = String(data);

    // set this’s data to data and this’s node document to current global object’s associated Document.
    super(data, globalThis.document as Document);
  }

  override get nodeType(): NodeType.TEXT_NODE | NodeType.CDATA_SECTION_NODE {
    return NodeType.TEXT_NODE;
  }

  override get nodeName(): "#text" | "#cdata-section" {
    return "#text";
  }

  protected override clone(document: Document): Text {
    return Text[$create]({ data: this._data, nodeDocument: document });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-wholetext
   */
  get wholeText(): string {
    const textNodes = contiguousTextNodes(this);
    const data = imap(textNodes, (text) => text._data);
    // to return the concatenation of the data of the contiguous Text nodes of this, in tree order.
    const list = new List(data);

    return concatString(list);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-splittext
   */
  splitText(offset: number): Text {
    // to split this with offset offset.
    return splitText(this, offset);
  }
}

// deno-lint-ignore no-empty-interface
export interface Text extends Slottable {}

/**
 * @see https://dom.spec.whatwg.org/#concept-text-split
 */
export function splitText(node: Text, offset: number): Text {
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
  const newNode = Text[$create]({
    data: newData,
    nodeDocument: node[$nodeDocument],
  });

  // 6 Let parent be node’s parent.
  const parent = node._parent;

  // 7 If parent is not null, then:
  if (isNotNull(parent)) {
    // 1 Insert new node into parent before node’s next sibling.
    insertNode(newNode, parent, getNextSibling(node));

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

/**
 * @see https://dom.spec.whatwg.org/#concept-child-text-content
 */
export function getChildTextContent(node: Node): string {
  // concatenation of the data of all the Text node children of node, in tree order.
  return [...imap(
    ifilter(orderTreeChildren(node._children), isText),
    (text) => text["_data"],
  )].join("");
}

/**
 * @see https://dom.spec.whatwg.org/#contiguous-text-nodes
 */
export function* contiguousTextNodes(node: Text): Iterable<Text> {
  const preceding = getPrecedingSiblings(node);
  const precedingTexts = takewhile(preceding, isText) as Iterable<Text>;
  const following = getFollowingSiblings(node);
  const followingTexts = takewhile(following, isText) as Iterable<Text>;

  yield* [...precedingTexts].reverse();
  yield node;
  yield* followingTexts;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-descendant-text-content
 */
export function descendantTextContent(node: Node): string {
  const descendants = getDescendants(node) as Iterable<Node>;
  const textDescendants = ifilter(descendants, isText);
  const dataList = imap(textDescendants, (text) => text["_data"]);

  return concatString(new List(dataList));
}
