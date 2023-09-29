import type { IHTMLScriptElement } from "../../../interface.d.ts";
import { HTMLElement } from "../../dom/html_element.ts";
import { reflectSet } from "../../../dom/nodes/utils/set_attribute_value.ts";
import { reflectGet } from "../../../dom/nodes/elements/element_utils.ts";
import { Exposed } from "../../../webidl/extended_attribute.ts";
import {
  ImportMapParseResult,
  Script,
} from "../../web_application_apis/scripting.ts";
import { internalSlots } from "../../internal.ts";

@Exposed(Window)
export class HTMLScriptElement extends HTMLElement
  implements IHTMLScriptElement {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);

    internalSlots.extends<HTMLScriptElement>(
      this,
      new HTMLScriptElementInternals(),
    );
  }
  get async(): boolean {
    throw new Error("async#getter");
  }
  set async(value: boolean) {
    throw new Error("async#setter");
  }

  get charset(): string {
    throw new Error("charset#getter");
  }
  set charset(value: string) {
    throw new Error("charset#setter");
  }
  get crossOrigin(): string | null {
    throw new Error("crossOrigin#getter");
  }
  set crossOrigin(value: string | null) {
    throw new Error("crossOrigin#setter");
  }

  get defer(): boolean {
    throw new Error("defer#getter");
  }
  set defer(value: boolean) {
    throw new Error("defer#setter");
  }

  get event(): string {
    throw new Error("event#getter");
  }
  set event(value: string) {
    throw new Error("event#setter");
  }

  get htmlFor(): string {
    throw new Error("htmlFor#getter");
  }
  set htmlFor(value: string) {
    throw new Error("htmlFor#setter");
  }
  get integrity(): string {
    throw new Error("integrity#getter");
  }
  set integrity(value: string) {
    throw new Error("integrity#setter");
  }
  get noModule(): boolean {
    throw new Error("noModule#getter");
  }
  set noModule(value: boolean) {
    throw new Error("noModule#setter");
  }

  get referrerPolicy(): string {
    throw new Error("referrerPolicy#getter");
  }
  set referrerPolicy(value: string) {
    throw new Error("referrerPolicy#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/scripting.html#dom-script-src
   */
  get src(): string {
    return reflectGet(this, "src");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/scripting.html#dom-script-src
   */
  set src(value: string) {
    reflectSet(this, "src", value);
  }

  get text(): string {
    throw new Error("text#getter");
  }
  set text(value: string) {
    throw new Error("text#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    reflectSet(this, "src", value);
  }
}

export class HTMLScriptElementInternals {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#parser-document)
   */
  parserDocument: Document | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#concept-script-external)
   */
  fromExternalFile = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#preparation-time-document)
   */
  preparationTimeDocument: Document | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#already-started)
   */
  alreadyStarted = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#concept-script-type)
   */
  type: "classic" | "module" | "importmap" | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#concept-script-result)
   */
  result: "uninitialized" | Script | ImportMapParseResult | null =
    "uninitialized";
}
