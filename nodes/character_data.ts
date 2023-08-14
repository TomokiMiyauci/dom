import { Node } from "./node.ts";
import { ChildNode } from "./child_node.ts";
import { NonDocumentTypeChildNode } from "./non_document_type_child_node.ts";
import { type Document } from "./document.ts";
import { UnImplemented } from "./utils.ts";
import { type ICharacterData } from "../interface.d.ts";
import { $data, $nodeDocument } from "./internal.ts";

export abstract class CharacterData extends Node implements ICharacterData {
  [$data]: string;

  constructor(data: string, document: Document) {
    super();

    this[$data] = data;
    this[$nodeDocument] = document;
  }

  override [$nodeDocument]: Document;

  override get nodeValue(): string {
    return this[$data];
  }

  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    return this[$data];
  }

  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  get length(): number {
    throw new UnImplemented();
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
  set data(value: string) {
    throw new UnImplemented();
  }

  appendData(data: string): void {
    throw new UnImplemented();
  }

  deleteData(offset: number, count: number): void {
    throw new UnImplemented();
  }

  insertData(offset: number, data: string): void {
    throw new UnImplemented();
  }

  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new UnImplemented();
  }

  replaceData(offset: number, count: number, data: string): void {
    throw new UnImplemented();
  }

  substringData(offset: number, count: number): string {
    throw new UnImplemented();
  }
}

export interface CharacterData extends ChildNode, NonDocumentTypeChildNode {}

/**
 * @see https://dom.spec.whatwg.org/#concept-cd-substring
 */
export function substringData(
  node: Node,
  offset: number,
  count: number,
): string {
  throw new UnImplemented();
}

/**
 * @see https://dom.spec.whatwg.org/#concept-cd-replace
 */
export function replaceData(
  node: Node,
  offset: number,
  count: number,
  data: string,
) {
  // 1 Let length be node’s length.

  // 2 If offset is greater than length, then throw an "IndexSizeError" DOMException.

  // 3 If offset plus count is greater than length, then set count to length minus offset.

  // 4 Queue a mutation record of "characterData" for node with null, null, node’s data, « », « », null, and null.

  // 5 Insert data into node’s data after offset code units.

  // 6 Let delete offset be offset + data’s length.

  // 7 Starting from delete offset code units, remove count code units from node’s data.

  // 8 For each live range whose start node is node and start offset is greater than offset but less than or equal to offset plus count, set its start offset to offset.

  // 9 For each live range whose end node is node and end offset is greater than offset but less than or equal to offset plus count, set its end offset to offset.

  // 10 For each live range whose start node is node and start offset is greater than offset plus count, increase its start offset by data’s length and decrease it by count.

  // 11 For each live range whose end node is node and end offset is greater than offset plus count, increase its end offset by data’s length and decrease it by count.

  // 12 If node’s parent is non-null, then run the children changed steps for node’s parent.
}
