import type { IHTMLMetaElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { reflectGet } from "../../../nodes/elements/element_utils.ts";
import { reflectSet } from "../../../nodes/utils/set_attribute_value.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLMetaElement")
export class HTMLMetaElement extends HTMLElement implements IHTMLMetaElement {
  get content(): string {
    return reflectGet(this, "content");
  }
  set content(value: string) {
    reflectSet(this, "content", value);
  }

  get httpEquiv(): string {
    throw new Error("httpEquiv#getter");
  }
  set httpEquiv(value: string) {
    throw new Error("httpEquiv#setter");
  }
  get media(): string {
    throw new Error("media#getter");
  }
  set media(value: string) {
    throw new Error("media#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/semantics.html#dom-meta-name
   */
  get name(): string {
    return reflectGet(this, "name");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/semantics.html#dom-meta-name
   */
  set name(value: string) {
    reflectSet(this, "name", value);
  }

  get scheme(): string {
    throw new Error("scheme#getter");
  }
  set scheme(value: string) {
    throw new Error("scheme#setter");
  }
}
