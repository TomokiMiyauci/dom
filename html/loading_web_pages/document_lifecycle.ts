import { appendNode } from "../../dom/nodes/node_trees/mutation.ts";
import { createElement } from "../../dom/nodes/utils/create_element.ts";
import { Namespace } from "../../infra/namespace.ts";
import {
  NavigationParams,
  setOngoingNavigation,
} from "./navigation_and_session_history.ts";
import { $ } from "../internal.ts";
import { matchAboutBlank } from "../infra/url.ts";
import * as DOM from "../../internal.ts";
import {
  activeDocument,
  activeWindow,
} from "./infrastructure_for_sequences_of_documents/browsing_context.ts";
import {
  activeBrowsingContext,
  activeDocument as navigableActiveDocument,
  Navigable,
} from "./infrastructure_for_sequences_of_documents/navigable.ts";
import {
  CrossOriginOpenerPolicy,
  CrossOriginOpenerPolicyEnforcementResult,
  obtainBrowsingContextToUseForNavigationResponse,
  OpaqueOrigin,
  PolicyContainer,
  sameOriginDomain,
} from "./supporting_concepts.ts";
import { navigationID } from "../internal.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#populate-with-html/head/body)
 */
export function populateHTMLHeadBody(document: Document): void {
  // 1. Let html be the result of creating an element given document, html, and the HTML namespace.
  const html = createElement(document, "html", Namespace.HTML);

  // 2. Let head be the result of creating an element given document, head, and the HTML namespace.
  const head = createElement(document, "head", Namespace.HTML);

  // 3. Let body be the result of creating an element given document, body, and the HTML namespace.
  const body = createElement(document, "body", Namespace.HTML);

  // 4. Append html to document.
  appendNode(html, document);

  // 5. Append head to html.
  appendNode(head, html);

  // 6. Append body to html.
  appendNode(body, html);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#completely-loaded)
 */
export function completelyLoaded(document: Document): boolean {
  return $(document).completelyLoadedTime !== null;
}

export function createAndInitializeDocument(
  type: "xml" | "html",
  contentType: string,
  navigationParams: NavigationParams,
): Document {
  // 1. Let browsingContext be navigationParams's navigable's active browsing context.
  let browsingContext = activeBrowsingContext(navigationParams.navigable);

  // 2. Set browsingContext to the result of the obtaining a browsing context to use for a navigation response given browsingContext, navigationParams's final sandboxing flag set, navigationParams's cross-origin opener policy, and navigationParams's COOP enforcement result.
  browsingContext = browsingContext &&
    obtainBrowsingContextToUseForNavigationResponse(
      browsingContext,
      navigationParams.finalSandboxingFlagSet,
      navigationParams.crossOriginOpenerPolicy,
      navigationParams.COOPEnforcementResult,
    );

  // 3. Let permissionsPolicy be the result of creating a permissions policy from a response given navigationParams's navigable's container, navigationParams's origin, and navigationParams's response. [PERMISSIONSPOLICY]

  // 4. Let creationURL be navigationParams's response's URL.
  let creationURL = new URL(navigationParams.response.url); // TODO use internal URL

  // 5. If navigationParams's request is non-null, then set creationURL to navigationParams's request's current URL.
  if (navigationParams.request) {}

  // 6. Let window be null.
  let window = null;

  const browsingContextActiveDocument = activeDocument(browsingContext!);
  // 7. If browsingContext's active document's is initial about:blank is true, and browsingContext's active document's origin is same origin-domain with navigationParams's origin,
  if (
    $(browsingContextActiveDocument).isInitialAboutBlank &&
    sameOriginDomain(
      DOM.$(browsingContextActiveDocument).origin,
      navigationParams.origin,
    )
    // then set window to browsingContext's active window.
    // 8. Otherwise:
  ) window = activeWindow(browsingContext!);
  else {
    // 1. Let oacHeader be the result of getting a structured field value given `Origin-Agent-Cluster` and "item" from navigationParams's response's header list.

    // 2. Let requestsOAC be true if oacHeader is not null and oacHeader[0] is the boolean true; otherwise false.

    // 3. If navigationParams's reserved environment is a non-secure context, then set requestsOAC to false.

    // 4. Let agent be the result of obtaining a similar-origin window agent given navigationParams's origin, browsingContext's group, and requestsOAC.

    // 5. Let realmExecutionContext be the result of creating a new realm given agent and the following customizations:
    // - For the global object, create a new Window object.
    // - For the global this binding, use browsingContext's WindowProxy object.

    // 6. Set window to the global object of realmExecutionContext's Realm component.

    // 7. Let topLevelCreationURL be creationURL.
    let topLevelCreationURL = creationURL;

    // 8. Let topLevelOrigin be navigationParams's origin.
    let topLevelOrigin = navigationParams.origin;

    // 9. If navigable's container is not null, then:

    // 1. Let parentEnvironment be navigable's container's relevant settings object.

    // 2. Set topLevelCreationURL to parentEnvironment's top-level creation URL.

    // 3. Set topLevelOrigin to parentEnvironment's top-level origin.

    // 10. Set up a window environment settings object with creationURL, realmExecutionContext, navigationParams's reserved environment, topLevelCreationURL, and topLevelOrigin.
  }

  // 9. Let loadTimingInfo be a new document load timing info with its navigation start time set to navigationParams's response's timing info's start time.

  // 10. Let document be a new Document, with
  const document = new Document();
  // type: type
  DOM.$(document).type = type;
  // content type: contentType
  DOM.$(document).contentType = contentType;
  // origin: navigationParams's origin
  DOM.$(document).origin = navigationParams.origin;
  // browsing context: browsingContext
  $(document).browsingContext = browsingContext;
  // policy container: navigationParams's policy container
  $(document).policyContainer = navigationParams.policyContainer;
  // permissions policy: permissionsPolicy
  // active sandboxing flag set: navigationParams's final sandboxing flag set
  // cross-origin opener policy: navigationParams's cross-origin opener policy
  $(document).crossOriginOpenerPolicy =
    navigationParams.crossOriginOpenerPolicy;
  // load timing info: loadTimingInfo
  // was created via cross-origin redirects: navigationParams's response's has cross-origin redirects
  // during-loading navigation ID for WebDriver BiDi: navigationParams's id
  $(document).duringLoadingNavigationIDForWebDriverBiDi = navigationParams.id;
  // URL: creationURL
  DOM.$(document).URL = creationURL;
  // current document readiness: "loading"

  // about base URL: navigationParams's about base URL
  $(document).aboutBaseURL = navigationParams.aboutBaseURL;

  // 11. Set window's associated Document to document.

  // 12. Run CSP initialization for a Document given document. [CSP]

  // 13. If navigationParams's request is non-null, then:
  if (navigationParams.request) {
    // 1. Set document's referrer to the empty string.

    // 2. Let referrer be navigationParams's request's referrer.

    // 3. If referrer is a URL record, then set document's referrer to the serialization of referrer.
  }

  // 14. If navigationParams's fetch controller is not null, then:
  if (navigationParams.fetchController) {
    // 1. Let fullTimingInfo be the result of extracting the full timing info from navigationParams's fetch controller.

    // 2. Let redirectCount be 0 if navigationParams's response's has cross-origin redirects is true; otherwise navigationParams's request's redirect count.

    // 3. Create the navigation timing entry for document, given fullTimingInfo, redirectCount, navigationTimingType, navigationParams's response's service worker timing info, and navigationParams's response's body info.
  }

  // 15. Create the navigation timing entry for document, with navigationParams's response's timing info, redirectCount, navigationParams's navigation timing type, and navigationParams's response's service worker timing info.

  // 16. If navigationParams's response has a `Refresh` header, then:
  if (navigationParams.response.headers.has("Refresh")) {
    // 1. Let value be the isomorphic decoding of the value of the header.

    // 2. Run the shared declarative refresh steps with document and value.
  }

  // 17. If navigationParams's commit early hints is not null, then call navigationParams's commit early hints with document.
  if (navigationParams.commitEarlyHints) {}

  // 18. Process link headers given document, navigationParams's response, and "pre-media".

  // 19. Return document.
  return document;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#navigate-html)
 */
export function loadHTMLDocument(
  navigationParams: NavigationParams,
): Document {
  // 1. Let document be the result of creating and initializing a Document object given "html", "text/html", and navigationParams.
  const document = createAndInitializeDocument(
    "html",
    "text/html",
    navigationParams,
  );

  // 2. If document's URL is about:blank, then populate with html/head/body given document.
  if (matchAboutBlank(DOM.$(document).URL)) populateHTMLHeadBody(document);
  // 3. Otherwise,
  else {
    // create an HTML parser and associate it with the document. Each task that the networking task source places on the task queue while fetching runs must then fill the parser's input byte stream with the fetched bytes and cause the HTML parser to perform the appropriate processing of the input stream.
    // The first task that the networking task source places on the task queue while fetching runs must process link headers given document, navigationParams's response, and "media", after the task has been processed by the HTML parser.

    // Before any script execution occurs, the user agent must wait for scripts may run for the newly-created document to be true for document.

    // When no more bytes are available, the user agent must queue a global task on the networking task source given document's relevant global object to have the parser to process the implied EOF character, which eventually causes a load event to be fired.
  }

  // 4. Return document.
  return document;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#read-ua-inline)
 */
export function displayInlineContent(
  navigable: Navigable,
  navigationId: string | null,
  navTimingType: NavigationTimingType,
): Document {
  // 1. Let origin be a new opaque origin.
  const origin = new OpaqueOrigin();

  // 2. Let coop be a new cross-origin opener policy.
  const coop = new CrossOriginOpenerPolicy();

  // 3. Let coopEnforcementResult be a new cross-origin opener policy enforcement result with
  const coopEnforcementResult = new CrossOriginOpenerPolicyEnforcementResult({
    // url: response's URL
    url: {} as any, // TODO where is response?
    // origin: origin
    origin,
    // cross-origin opener policy: coop
    crossOriginOpenerPolicy: coop,
  });

  // 4. Let navigationParams be a new navigation params with
  const navigationParams: NavigationParams = {
    // id: navigationId
    id: navigationId,
    // navigable: navigable
    navigable,
    // request: null
    request: null,
    // response: a new response
    response: new Response(),
    // origin: origin
    origin,
    // fetch controller: null
    fetchController: null,
    // commit early hints: null
    commitEarlyHints: null,
    // COOP enforcement result: coopEnforcementResult
    COOPEnforcementResult: coopEnforcementResult,
    // reserved environment: null
    reservedEnvironment: null,
    // policy container: a new policy container
    policyContainer: new PolicyContainer(),
    // final sandboxing flag set: an empty set
    finalSandboxingFlagSet: new Set(),
    // cross-origin opener policy: coop
    crossOriginOpenerPolicy: coop,
    // navigation timing type: navTimingType
    navigationTimingType: navTimingType,
    // about base URL: null
    aboutBaseURL: null,
  };

  // 5. Let document be the result of creating and initializing a Document object given "html", "text/html", and navigationParams.
  const document = createAndInitializeDocument(
    "html",
    "text/html",
    navigationParams,
  );

  // 6. Either associate document with a custom rendering that is not rendered using the normal Document rendering rules, or mutate document until it represents the content the user agent wants to render.
  // TODO

  // 7. Return document.
  return document;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#abort-a-document)
 */
export function abortDocument(document: Document) {}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#nav-stop)
 */
export function stopLoading(navigable: Navigable) {
  // 1. Let document be navigable's active document.
  const document = navigableActiveDocument(navigable);

  if (!document) return;

  // 2. If document's unload counter is 0, and navigable's ongoing navigation is a navigation ID,
  if (
    !$(document).unloadCounter && navigable.ongoingNavigation === navigationID
    // then set the ongoing navigation for navigable to null.
  ) setOngoingNavigation(navigable, null);

  // 3. Abort document.
  abortDocument(document);
}
