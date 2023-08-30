import { Node } from "./node.ts";
import { ChildNode } from "./child_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { type Document } from "./document.ts";
import { type ICharacterData } from "../interface.d.ts";
import { $data, $nodeDocument } from "./internal.ts";
import { nodeLength } from "./node_tree.ts";
import { DOMExceptionName } from "../webidl/exception.ts";
import { queueMutationRecord } from "./mutation_observer.ts";
import { OrderedSet } from "../infra/data_structures/set.ts";
import { LegacyNullToEmptyString } from "../webidl/legacy_extended_attributes.ts";
import { convert, unsignedLong } from "../webidl/types.ts";

export interface CharacterDataStates {
  /**
   * @see https://dom.spec.whatwg.org/#concept-cd-data
   */
  data: string;
}

@ChildNode
@NonDocumentTypeChildNode
export abstract class CharacterData extends Node implements ICharacterData {
  [$data]: string;

  constructor(data: string, document: Document) {
    super();

    this[$data] = data;
    this[$nodeDocument] = document;
  }

  override [$nodeDocument]: Document;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    return this[$data];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(value: string | null) {
    value ??= "";
    // Replace data with node this, offset 0, count this’s length, and data the given value.
    replaceData(this, 0, nodeLength(this), value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    return this[$data];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string) {
    // Replace data with node this, offset 0, count this’s length, and data the given value.
    replaceData(this, 0, nodeLength(this), value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this[$nodeDocument];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-length
   */
  get length(): number {
    // return this’s length.
    return nodeLength(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-data
   */
  get data(): string {
    // to return this’s data.
    return this[$data];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-data
   */
  @LegacyNullToEmptyString
  set data(value: string) {
    // replace data with node this, offset 0, count this’s length, and data new value.
    replaceData(this, 0, nodeLength(this), value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-appenddata
   */
  appendData(data: string): void {
    // replace data with node this, offset this’s length, count 0, and data data
    replaceData(this, nodeLength(this), 0, data);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-deletedata
   */
  @convert
  deleteData(@unsignedLong offset: number, @unsignedLong count: number): void {
    // replace data with node this, offset offset, count count, and data the empty string.
    replaceData(this, offset, count, "");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-insertdata
   */
  @convert
  insertData(@unsignedLong offset: number, data: string): void {
    // replace data with node this, offset offset, count 0, and data data.
    replaceData(this, offset, 0, data);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-replacedata
   * @throws {DOMException}
   */
  @convert
  replaceData(
    @unsignedLong offset: number,
    @unsignedLong count: number,
    data: string,
  ): void {
    // replace data with node this, offset offset, count count, and data data.
    replaceData(this, offset, count, data);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-substringdata
   * @throws {TypeError}
   * @throws {DOMException}
   */
  @convert
  substringData(
    @unsignedLong offset: number,
    @unsignedLong count: number,
  ): string {
    // return the result of running substring data with node this, offset offset, and count count.
    return substringData(this, offset, count);
  }
}

export interface CharacterData extends ChildNode, NonDocumentTypeChildNode {}

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
  if (offset + count > length) return node[$data].slice(offset);

  // 4. Return a string whose value is the code units from the offsetth code unit to the offset+countth code unit in node’s data.
  return node[$data].slice(offset, offset + count);
}

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
