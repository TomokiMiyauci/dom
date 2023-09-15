import type { IHTMLIFrameElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { DOMTokenList } from "../../dom/sets/dom_token_list.ts";
import { reflect } from "../infrastructure.ts";
import { PutForwards, SameObject } from "../../webidl/extended_attribute.ts";
import { fireEvent } from "../../dom/events/fire.ts";
import { reflectSet } from "../../dom/nodes/elements/element_utils.ts";
import { $ } from "../../internal.ts";
import { matchAboutBlank } from "../infra/url.ts";

export class HTMLIFrameElement extends HTMLElement
  implements IHTMLIFrameElement {
  constructor(args: any) {
    super(args);

    $(this).insertionSteps.define((element: any) => {
      // 1. Create a new child navigable for element.

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
    throw new Error("contentDocument");
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
    throw new Error("src#getter");
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
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#process-the-iframe-attributes)
 */
export function processIframeAttributes(
  element: Element,
  initialInsertion = false,
) {
  // 1. If element's srcdoc attribute is specified, then:
  if (element.hasAttribute("srcdoc")) {}
  // 2. Otherwise:
  else {
    // 1. Let url be the result of running the shared attribute processing steps for iframe and frame elements given element and initialInsertion.
    const url = sharedAttributeProcessingSteps(
      element,
      initialInsertion,
    );

    // 2. If url is null, then return.
    if (!url) return;

    // 3. If url matches about:blank and initialInsertion is true, then:
    if (matchAboutBlank(url) && initialInsertion) {
      // 1. Run the iframe load event steps given element.
      iframeLoadEventSteps(element);

      // 2. Return.
      return;
    }

    // 4. Let referrerPolicy be the current state of element's referrerpolicy content attribute.

    // 5. Set element's current navigation was lazy loaded boolean to false.

    // 6. If the will lazy load element steps given element return true, then:

    // 1. Set element's lazy load resumption steps to the rest of this algorithm starting with the step labeled navigate.

    // 2. Set element's current navigation was lazy loaded boolean to true.

    // 3. Start intersection-observing a lazy loading element for element.

    // 4. Return.

    // 7. Navigate: navigate an iframe or frame given element, url, and referrerPolicy.
  }
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#shared-attribute-processing-steps-for-iframe-and-frame-elements)
 */
export function sharedAttributeProcessingSteps(
  element: Element,
  initialInsertion: boolean,
): URL | null {
  // 1. Let url be the URL record about:blank.
  let url = new URL("about:blank");

  const src = element.getAttribute("src");
  // 2. If element has a src attribute specified, and its value is not the empty string, then parse the value of that attribute relative to element's node document. If this is successful, then set url to the resulting URL record.
  // TODO
  if (src) {
    // const parsed = new URL(src);

    // url = parsed;
  }

  // 3. If the inclusive ancestor navigables of element's node navigable contains a navigable whose active document's URL equals url with exclude fragments set to true, then return null.

  // 4. If url matches about:blank and initialInsertion is true, then perform the URL and history update steps given element's content navigable's active document and url.

  // 5. Return url.
  return url;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#iframe-load-event-steps)
 */
export function iframeLoadEventSteps(element: Element) {
  // 1. Assert: element's content navigable is not null.

  // 2. Let childDocument be element's content navigable's active document.

  // 3. If childDocument has its mute iframe load flag set, then return.

  // 4. If element's pending resource-timing start time is not null, then:

  // 5. Let global be element's node document's relevant global object.

  // 6. Let fallbackTimingInfo be a new fetch timing info whose start time is element's pending resource-timing start time and whose response end time is the current high resolution time given global.

  // 7. Mark resource timing given fallbackTimingInfo, url, "iframe", global, the empty string, a new response body info, and 0.

  // 8. Set element's pending resource-timing start time to null.

  // 9. Set childDocument's iframe load in progress flag.

  // 6. Fire an event named load at element.
  fireEvent("load", element);

  // 7. Unset childDocument's iframe load in progress flag.
}
