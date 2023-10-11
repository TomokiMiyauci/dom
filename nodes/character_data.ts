import { Node } from "./node.ts";
import { type ICharacterData } from "../interface.d.ts";
import { nodeLength } from "./utils/node_tree.ts";
import { LegacyNullToEmptyString } from "../_internals/webidl/legacy_extended_attributes.ts";
import {
  convert,
  DOMString,
  unsignedLong,
} from "../_internals/webidl/types.ts";
import { replaceData, substringData } from "./utils/character_data.ts";
import { internalSlots } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";

@Exposed("Window", "CharacterData")
export abstract class CharacterData extends Node implements ICharacterData {
  constructor() {
    super();

    internalSlots.extends<CharacterData>(
      this,
      new CharacterDataInternals(),
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
  @convert
  set data(@DOMString value: string) {
    // replace data with node this, offset 0, count this’s length, and data new value.
    replaceData(this, 0, nodeLength(this), value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-characterdata-appenddata
   */
  @convert
  appendData(@DOMString data: string): void {
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
  insertData(@unsignedLong offset: number, @DOMString data: string): void {
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

  get #_() {
    return internalSlots.get<CharacterData>(this);
  }
}

export class CharacterDataInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-cd-data)
   */
  data!: string;
}
