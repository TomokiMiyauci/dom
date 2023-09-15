import { Node, NodeInternals } from "./node.ts";
import { ChildNode } from "./node_trees/child_node.ts";
import { NonDocumentTypeChildNode } from "./node_trees/non_document_type_child_node.ts";
import { type ICharacterData } from "../../interface.d.ts";
import { nodeLength } from "./node_trees/node_tree.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { LegacyNullToEmptyString } from "../../webidl/legacy_extended_attributes.ts";
import { convert, unsignedLong } from "../../webidl/types.ts";
import { replaceData } from "./character_data_algorithm.ts";
import { $, internalSlots } from "../../internal.ts";

export interface CharacterDataStates {
  /**
   * @see https://dom.spec.whatwg.org/#concept-cd-data
   */
  data: string;
}

@ChildNode
@NonDocumentTypeChildNode
export abstract class CharacterData extends Node implements ICharacterData {
  constructor(data: string, document: Document) {
    super(document);

    internalSlots.set(
      this,
      new CharacterDataInternals({ data, nodeDocument: document }),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): string {
    return this.#_.data;
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
    return this.#_.data;
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
    return this.#_.nodeDocument;
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
    return this.#_.data;
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

  get #_(): CharacterDataInternals {
    return internalSlots.get(this);
  }
}

export interface CharacterData extends ChildNode, NonDocumentTypeChildNode {}

export class CharacterDataInternals extends NodeInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-cd-data)
   */
  data: string;

  constructor(
    { data, nodeDocument }:
      & { data: string }
      & Pick<NodeInternals, "nodeDocument">,
  ) {
    super(nodeDocument);

    this.data = data;
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-cd-substring
 * @throws {DOMException}
 */
export function substringData(
  node: globalThis.CharacterData,
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
