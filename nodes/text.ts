import { NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { List } from "../_internals/infra/data_structures/list.ts";
import type { IText } from "../interface.d.ts";
import { iter } from "../deps.ts";
import { concatString } from "../_internals/infra/string.ts";
import { $, tree } from "../internal.ts";
import { Get } from "../utils.ts";
import { splitText } from "./utils/split_text.ts";
import { data } from "../symbol.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { isMyText } from "./utils/type.ts";
import * as $$ from "../symbol.ts";

@Exposed("Window", "Text")
export class Text extends CharacterData implements IText {
  /**
   * @see https://dom.spec.whatwg.org/#dom-text-text
   */
  constructor(data: string = "") {
    // Current Restrictions: parameter decorator alone cannot override arguments
    data = String(data);
    super();

    // set this’s data to data and this’s node document to current global object’s associated Document.
    this[$$.data] = data;
    this[$$.nodeDocument] = globalThis.document;
  }

  override get nodeType(): NodeType.TEXT_NODE | NodeType.CDATA_SECTION_NODE {
    return NodeType.TEXT_NODE;
  }

  override get nodeName(): "#text" | "#cdata-section" {
    return "#text";
  }

  protected override clone(document: Document): globalThis.Text {
    const text = new Text();
    text[data] = this[data], text[$$.nodeDocument] = document;
    return text;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-wholetext
   */
  get wholeText(): string {
    const contiguousTextNodes = tree.contiguousTextNodes(this);
    const dataList = iter(contiguousTextNodes).filter(isMyText)
      .map(Get.data);
    // to return the concatenation of the data of the contiguous Text nodes of this, in tree order.
    const list = new List(dataList);

    return concatString(list);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-text-splittext
   */
  splitText(offset: number): globalThis.Text {
    // to split this with offset offset.
    return splitText(this, offset);
  }

  [$$.data]: string;
}
