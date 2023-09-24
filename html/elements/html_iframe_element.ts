import type { IHTMLIFrameElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../dom/sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { reflectSet } from "../../dom/nodes/utils/set_attribute_value.ts";
import * as DOM from "../../internal.ts";
import { internalSlots } from "../internal.ts";
import { processIframeAttributes } from "./html_iframe_element_utils.ts";
import {
  contentDocument,
  createNewChildNavigable,
} from "../loading_web_pages/infrastructure_for_sequences_of_documents/navigable.ts";
import { Navigable } from "../loading_web_pages/infrastructure_for_sequences_of_documents/navigable.ts";
import { reflectGet } from "../../dom/nodes/elements/element_utils.ts";

export class HTMLIFrameElement extends HTMLElement
  implements IHTMLIFrameElement {
  constructor(args: any) {
    super(args);

    internalSlots.extends<HTMLIFrameElement>(
      this,
      new ContentNavigableInternals(),
    );
    this.#_.insertionSteps.define((element: any) => {
      // 1. Create a new child navigable for element.
      createNewChildNavigable(element);

      // 2. If element has a sandbox attribute, then parse the sandboxing directive given the attribute's value and element's iframe sandboxing flag set.

      // 3. Process the iframe attributes for element, with initialInsertion set to true.
      processIframeAttributes(element, true);
    });
  }

  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
  get allow(): string {
    throw new Error("allow#getter");
  }
  set allow(value: string) {
    throw new Error("allow#setter");
  }
  get allowFullscreen(): boolean {
    throw new Error("allowFullscreen#getter");
  }
  set allowFullscreen(value: boolean) {
    throw new Error("allowFullscreen#setter");
  }

  get contentDocument(): Document | null {
    return contentDocument(this);
  }

  get contentWindow(): WindowProxy | null {
    throw new Error("contentWindow");
  }

  get frameBorder(): string {
    throw new Error("frameBorder#getter");
  }
  set frameBorder(value: string) {
    throw new Error("frameBorder#setter");
  }

  get height(): string {
    throw new Error("height#getter");
  }
  set height(value: string) {
    throw new Error("height#setter");
  }
  get loading(): string {
    throw new Error("loading#getter");
  }
  set loading(value: string) {
    throw new Error("loading#setter");
  }

  get longDesc(): string {
    throw new Error("longDesc#getter");
  }
  set longDesc(value: string) {
    throw new Error("longDesc#setter");
  }

  get marginHeight(): string {
    throw new Error("marginHeight#getter");
  }
  set marginHeight(value: string) {
    throw new Error("marginHeight#setter");
  }

  get marginWidth(): string {
    throw new Error("marginWidth#getter");
  }
  set marginWidth(value: string) {
    throw new Error("marginWidth#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get referrerPolicy(): ReferrerPolicy {
    throw new Error("referrerPolicy#getter");
  }
  set referrerPolicy(value: ReferrerPolicy) {
    throw new Error("referrerPolicy#setter");
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/iframe-embed-object.html#dom-iframe-sandbox
   */
  @SameObject
  @PutForwards("value")
  get sandbox(): DOMTokenList {
    //  reflect the respective content attributes of the same name.
    return reflect(this, DOMTokenList, "sandbox");
  }

  get scrolling(): string {
    throw new Error("scrolling#getter");
  }
  set scrolling(value: string) {
    throw new Error("scrolling#setter");
  }

  get src(): string {
    return reflectGet(this, "src");
  }
  set src(value: string) {
    reflectSet(this, "src", value);
  }

  get srcdoc(): string {
    throw new Error("srcdoc#getter");
  }
  set srcdoc(value: string) {
    throw new Error("srcdoc#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }
  getSVGDocument(): Document | null {
    throw new Error("getSVGDocument");
  }

  get #_() {
    return DOM.$(this as HTMLIFrameElement);
  }
}

export class ContentNavigableInternals {
  contentNavigable: Navigable | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#current-navigation-was-lazy-loaded)
   */
  currentNavigationWasLazyLoaded = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#iframe-pending-resource-timing-start-time)
   */
  pendingResourceTimingStartTime = null;
}
