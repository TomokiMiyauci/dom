import { fireEvent } from "../../dom/events/fire.ts";
import * as DOM from "../../internal.ts";
import { $ } from "../internal.ts";
import { encodingParseURL, matchAboutBlank } from "../infra/url.ts";
import {
  activeDocument,
} from "../loading_web_pages/infrastructure_for_sequences_of_documents/navigable.ts";
import { willLoadElementSteps } from "../infra/fetching_resource.ts";
import {
  navigate,
  NavigationHistoryBehavior,
} from "../loading_web_pages/navigation_and_session_history.ts";
import { completelyLoaded } from "../loading_web_pages/document_lifecycle.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#process-the-iframe-attributes)
 */
export function processIframeAttributes(
  element: Element,
  initialInsertion = false,
): void {
  // 1. If element's srcdoc attribute is specified, then:
  if (element.hasAttribute("srcdoc")) {
    // 1. Set element's lazy load resumption steps to the rest of this algorithm starting with the step labeled navigate.

    // 2. Set element's current navigation was lazy loaded boolean to true.

    // 3. Start intersection-observing a lazy loading element for element.

    // 4. Return.
    return;
  }

  // 2. Otherwise:
  // 1. Let url be the result of running the shared attribute processing steps for iframe and frame elements given element and initialInsertion.
  // TODO
  const url: URL | null = new URL("about:blank");
  // const url = sharedAttributeProcessingSteps(
  //   element,
  //   initialInsertion,
  // );

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
  const referrerPolicy: ReferrerPolicy =
    element.getAttribute("referrerpolicy") as ReferrerPolicy ?? "";

  // 5. Set element's current navigation was lazy loaded boolean to false.
  $(element).currentNavigationWasLazyLoaded = false;

  // 6. If the will lazy load element steps given element return true, then:
  if (willLoadElementSteps(element)) {
    // 1. Set element's lazy load resumption steps to the rest of this algorithm starting with the step labeled navigate.

    // 2. Set element's current navigation was lazy loaded boolean to true.

    // 3. Start intersection-observing a lazy loading element for element.

    // 4. Return.
    return;
  }

  // 7. Navigate: navigate an iframe or frame given element, url, and referrerPolicy.
  navigateIframeOrFrame(element, url, referrerPolicy);
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
  // 2. If element has a src attribute specified, and its value is not the empty string, then:
  if (src) {
    // 1. Let maybeURL be the result of encoding-parsing a URL given that attribute's value, relative to element's node document.
    const maybeURL = encodingParseURL(src, DOM.$(element).nodeDocument);

    // 2. If maybeURL is not failure, then set url to maybeURL.
    if (maybeURL) url = maybeURL;
  }

  // 3. If the inclusive ancestor navigables of element's node navigable contains a navigable whose active document's URL equals url with exclude fragments set to true, then return null.

  // 4. If url matches about:blank and initialInsertion is true, then perform the URL and history update steps given element's content navigable's active document and url.

  // 5. Return url.
  return url;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#navigate-an-iframe-or-frame)
 */
export function navigateIframeOrFrame(
  element: Element,
  url: URL,
  referrerPolicy: ReferrerPolicy,
  srcdocString: string | null = null,
) {
  // 1. Let historyHandling be "auto".
  let historyHandling = NavigationHistoryBehavior.Auto;

  const { contentNavigable } = $(element);
  // 2. If element's content navigable's active document is not completely loaded, then set historyHandling to "replace".
  if (contentNavigable) {
    const contentNavigableActiveDocument = activeDocument(contentNavigable);
    if (
      contentNavigableActiveDocument &&
      completelyLoaded(contentNavigableActiveDocument)
    ) historyHandling = NavigationHistoryBehavior.Replace;
  }

  // 3. If element is an iframe, then set element's pending resource-timing start time to the current high resolution time given element's node document's relevant global object.
  if (isIframe(element)) {
  }

  // 4. Navigate element's content navigable to url using element's node document, with historyHandling set to historyHandling, referrerPolicy set to referrerPolicy, and documentResource set to scrdocString.
  contentNavigable && navigate(
    contentNavigable,
    url,
    DOM.$(element).nodeDocument,
    undefined,
    srcdocString,
    undefined,
    undefined,
    historyHandling,
    undefined,
    undefined,
    referrerPolicy,
  );
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#iframe-load-event-steps)
 */
export function iframeLoadEventSteps(element: Element): void {
  // 1. Assert: element's content navigable is not null.
  // 2. Let childDocument be element's content navigable's active document.
  const childDocument = activeDocument($(element).contentNavigable!);

  // 3. If childDocument has its mute iframe load flag set, then return.
  if (childDocument && $(childDocument).muteIframeLoad) return;

  // 4. If element's pending resource-timing start time is not null, then:
  if ($(element).pendingResourceTimingStartTime) {
    // 1. Let global be element's node document's relevant global object.

    // 2. Let fallbackTimingInfo be a new fetch timing info whose start time is element's pending resource-timing start time and whose response end time is the current high resolution time given global.

    // 3. Mark resource timing given fallbackTimingInfo, url, "iframe", global, the empty string, a new response body info, and 0.

    // 4. Set element's pending resource-timing start time to null.
    $(element).pendingResourceTimingStartTime = null;
  }

  // 5. Set childDocument's iframe load in progress flag.
  if (childDocument) $(childDocument).iframeLoadInProgress = true;

  // 6. Fire an event named load at element.
  fireEvent("load", element);

  // 7. Unset childDocument's iframe load in progress flag.
  if (childDocument) $(childDocument).iframeLoadInProgress = false;
}

export function isIframe(element: Element): element is HTMLIFrameElement {
  return element.localName.toLowerCase() === "iframe";
}
