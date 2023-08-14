import { type Node, type NodeStates, NodeType } from "./node.ts";
import { type Document } from "./document.ts";
import {
  CharacterData,
  type CharacterDataStates,
  replaceData,
  substringData,
} from "./character_data.ts";
import { isText, UnImplemented } from "./utils.ts";
import { Slottable } from "./slottable.ts";
import { List } from "../infra/list.ts";
import { insertNode } from "./mutation.ts";
import type { IText } from "../interface.d.ts";
import { len } from "./node_tree.ts";
import { orderTree } from "../trees/tree.ts";
import { $create, $data, $nodeDocument } from "./internal.ts";
import { ifilter, imap, isNotNull, tail } from "../deps.ts";

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
    // set this’s data to data and this’s node document to current global object’s associated Document.
    super(data, globalThis.document);
  }

  override get nodeType(): NodeType.TEXT_NODE {
    return NodeType.TEXT_NODE;
  }

  override get nodeName(): "#text" {
    return "#text";
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  protected override clone(document: Document): Text {
    return Text[$create]({ data: this[$data], nodeDocument: document });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-wholetext
   */
  get wholeText(): string {
    // to return the concatenation of the data of the contiguous Text nodes of this, in tree order.
    return concatTextData(contiguousTextNodes(this));
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-splittext
   */
  splitText(offset: number): Text {
    // to split this with offset offset.
    return splitText(this, offset);
  }
}

export interface Text extends Slottable {}

/**
 * @see https://dom.spec.whatwg.org/#concept-text-split
 */
export function splitText(node: Text, offset: number): Text {
  // 1 Let length be node’s length.
  const length = len(node);

  // 2 If offset is greater than length, then throw an "IndexSizeError" DOMException.
  // TODO
  if (offset > length) throw 0;

  // 3 Let count be length minus offset.
  const count = length - offset;

  // 4 Let new data be the result of substringing data with node node, offset offset, and count count.
  const newData = substringData(node, offset, count);

  // 5 Let new node be a new Text node, with the same node document as node. Set new node’s data to new data.
  const newNode = new Text(newData, node[$nodeDocument]);

  // 6 Let parent be node’s parent.
  const parent = node._parent;

  // 7 If parent is not null, then:
  if (isNotNull(parent)) {
    // 1 Insert new node into parent before node’s next sibling.
    insertNode(newNode, parent, node._nextSibling);

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
 * free translation
 * @see https://triple-underscore.github.io/DOM4-ja.html#_concatenate-text-data
 */
function concatTextData(list: List<Text>): string {
  return [...imap(list, (text) => text[$data])].join("");
}

/**
 * @see https://dom.spec.whatwg.org/#contiguous-text-nodes
 */
function contiguousTextNodes(node: Node): List<Text> {
  return contiguousSibling(node, isText);
}

/**
 * free translation
 * @see https://triple-underscore.github.io/DOM4-ja.html#_contiguous-nodes
 */
export function contiguousSibling(
  node: Node,
  condition: (node: Node) => node is Text,
): List<Text> {
  while (condition(node._previousSibling)) {
    node = node._previousSibling;
  }

  const list = new List<Text>();

  while (condition(node)) {
    list.append(node);

    node = node._nextSibling;
  }

  return list;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-descendant-text-content
 */
export function descendantTextContent(node: Node) {
  const list = new List<Text>();

  for (const text of ifilter(tail(orderTree(node)), isText)) list.append(text);

  return concatTextData(list);
}
