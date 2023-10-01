import {
  clonePolicyContainer,
  CrossOriginOpenerPolicy,
  CrossOriginOpenerPolicyEnforcementResult,
  determineNavigationParamsPolicyContainer,
  Origin,
  PolicyContainer,
  sameOrigin,
} from "../supporting_concepts.ts";
import {
  activeBrowsingContext,
  activeDocument,
  activeWindow,
  container,
  containerDocument,
  isTopLevelTraversable,
  Navigable,
} from "../infrastructure_for_sequences_of_documents/navigable.ts";
import { StructuredSerializeForStorage } from "../../infra/safe_passing_of_structured_data.ts";
import * as DOM from "../../../internal.ts";
import { displayInlineContent } from "../document_lifecycle.ts";
import { $, internalSlots } from "../../internal.ts";
import {
  determineOrigin,
} from "../infrastructure_for_sequences_of_documents/browsing_context.ts";
import {
  FetchController,
  isFetchScheme,
  isHTTPScheme,
  locationURL as getLocationURL,
  processNextManualRedirect,
} from "../../../fetch/infrastructure.ts";
import { DocumentState, SessionHistoryEntry } from "./session_history.ts";
import {
  attemptToCreateNonFetchSchemeDocument,
  loadDocument,
  NavigationParams,
  NonFetchSchemeNavigationParams,
  SourceSnapshotParams,
  TargetSnapshotParams,
} from "./navigation.ts";
import { origin } from "../../../url/url.ts";
import { RequestInternals } from "../../../fetch/request.ts";
import { isNetworkError } from "../../../fetch/response.ts";
import { fetch } from "../../../fetch/fetching.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#attempt-to-populate-the-history-entry's-document)
 */
// 1. Assert: this is running in parallel.
export async function attemptPopulateHistoryEntryDocument(
  entry: SessionHistoryEntry,
  navigable: Navigable,
  navTimingType: NavigationTimingType,
  sourceSnapshotParams: SourceSnapshotParams,
  targetSnapshotParams: TargetSnapshotParams,
  navigationId: string | null = null,
  navigationParams: NavigationParams | NonFetchSchemeNavigationParams | null =
    null,
  cspNavigationType = "other",
  allowPOST = false,
  completionSteps: Function = () => {},
): Promise<void> {
  // 2. Assert: if navigationParams is non-null, then navigationParams's response is non-null.

  // 3. Let currentBrowsingContext be navigable's active browsing context.
  const currentBrowsingContext = activeBrowsingContext(navigable);

  // 4. Let documentResource be entry's document state's resource.
  const documentResource = entry.documentState.resource;

  // 5. If navigationParams is null, then:
  if (navigationParams === null) {
    // 1. If documentResource is a string,
    if (typeof documentResource === "string") {
      // then set navigationParams to the result of creating navigation params from a srcdoc resource given entry, navigable, targetSnapshotParams, navigationId, and navTimingType.
      navigationParams = createNavigationParamsFromSrcdocResource(
        entry,
        navigable,
        targetSnapshotParams,
        navigationId,
        navTimingType,
      );

      // 2. Otherwise, if all of the following are true:
    } else if (
      // - entry's URL's scheme is a fetch scheme; and
      isFetchScheme(
        entry.URL.protocol.slice(0, entry.URL.protocol.length - 1),
      ) &&
      // - documentResource is null, or allowPOST is true and documentResource's request body is not failure,
      (documentResource === null || (allowPOST && documentResource.requestBody))
    ) {
      // then set navigationParams to the result of creating navigation params by fetching given entry, navigable, sourceSnapshotParams, targetSnapshotParams, cspNavigationType, navigationId, and navTimingType.
      navigationParams = await createNavigationParamsByFetching(
        entry,
        navigable,
        sourceSnapshotParams,
        targetSnapshotParams,
        cspNavigationType,
        navigationId,
        navTimingType,
      );

      // 3. Otherwise, if entry's URL's scheme is not a fetch scheme,
    } else if (
      isFetchScheme(entry.URL.protocol.slice(0, entry.URL.protocol.length - 1))
    ) {
      // then set navigationParams to a new non-fetch scheme navigation params, with
      navigationParams = {
        // id: navigationId
        id: navigationId,
        // navigable: navigable
        navigable,
        // URL: entry's URL
        URL: entry.URL,
        // target snapshot sandboxing flags: targetSnapshotParams's sandboxing flags
        targetSnapshotSandboxingFlags: targetSnapshotParams.sandboxingFrags,
        // source snapshot has transient activation: sourceSnapshotParams's has transient activation
        sourceSnapshotHasTransientActivation:
          sourceSnapshotParams.hasTransientActivation,
        // initiator origin: entry's document state's initiator origin
        initiatorOrigin: entry.documentState.initiatorOrigin!,
        // navigation timing type: navTimingType
        navigationTimingType: navTimingType,
      };
    }
  }

  const navigableActiveWindow = activeWindow(navigable);

  // TODO
  if (!navigableActiveWindow) return;
  // 6. Queue a global task on the navigation and traversal task source, given navigable's active window, to run these steps:
  queueMicrotask(() => {
    // 1. If navigable's ongoing navigation no longer equals navigationId,
    // if (navigable.ongoingNavigation !== navigationId) {
    //   // then run completionSteps and return.
    //   completionSteps();
    //   return;
    // }

    // 2. Let failure be false.
    let failure = false;

    // 3. If navigationParams is a non-fetch scheme navigation params,
    if (navigationParams && "URL" in navigationParams) {
      // then set entry's document state's document to the result of running attempt to create a non-fetch scheme document given navigationParams.
      entry.documentState.document = attemptToCreateNonFetchSchemeDocument(
        navigationParams,
      );
      // 4. Otherwise, if navigationParams is null, then set failure to true.
    } else if (navigationParams === null) failure = true;

    // 5. Otherwise, if the result of should navigation response to navigation request of type in target be blocked by Content Security Policy? given navigationParams's request, navigationParams's response, navigationParams's policy container's CSP list, cspNavigationType, and navigable is "Blocked", then set failure to true. [CSP]

    // 6. Otherwise, if navigationParams's reserved environment is non-null and the result of checking a navigation response's adherence to its embedder policy given navigationParams's response, navigable, and navigationParams's policy container's embedder policy is false, then set failure to true.

    // 7. Otherwise, if the result of checking a navigation response's adherence to `X-Frame-Options` given navigationParams's response, navigable, navigationParams's policy container's CSP list, and navigationParams's origin is false, then set failure to true.

    // 8. If failure is true, then:
    if (failure) {
      // 1. Set entry's document state's document to the result of creating a document for inline content that doesn't have a DOM, given navigable, null, and navTimingType. The inline content should indicate to the user the sort of error that occurred.
      entry.documentState.document = displayInlineContent(
        navigable,
        null,
        navTimingType,
      );

      // 2. Set entry's document state's document's salvageable to false.
      $(entry.documentState.document).salvageable = false;

      // 3. If navigationParams is not null, then:
      if (navigationParams) {
        // 1. Run the environment discarding steps for navigationParams's reserved environment.

        // 2. Invoke WebDriver BiDi navigation failed with currentBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is navigationParams's response's URL.
      }

      // 9. Otherwise, if navigationParams's response's status is 204 or 205, then:
    } else if (
      navigationParams &&
      "response" in navigationParams &&
      new Set<number>([204, 205]).has(navigationParams.response.status)
    ) {
      // 1. Run completionSteps.
      completionSteps();

      // 2. Return.
      return;
      // 10. Otherwise, if navigationParams's response has a `Content-Disposition` header specifying the attachment disposition type, then:
    } else if (
      navigationParams &&
      "response" in navigationParams &&
      navigationParams.response.headers.has("Content-Disposition")
    ) {
      // 1. Let sourceAllowsDownloading be sourceSnapshotParams's allows downloading.
      const sourceAllowsDownloading = sourceSnapshotParams.allowsDownloading;

      // 2. Let targetAllowsDownloading be false if navigationParams's final sandboxing flag set has the sandboxed downloads browsing context flag set; otherwise true.

      // 3. Let uaAllowsDownloading be true.
      let uaAllowsDownloading = true;

      // 4. Optionally, the user agent may set uaAllowsDownloading to false, if it believes doing so would safeguard the user from a potentially hostile download.

      // 5. If sourceAllowsDownloading, targetAllowsDownloading, and uaAllowsDownloading are true, then:
      // TODO
      if (sourceAllowsDownloading && uaAllowsDownloading) {
        // 1. Handle navigationParams's response as a download.

        // 2. Invoke WebDriver BiDi download started with currentBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "complete", and url is navigationParams's response's URL.
      }

      // 6. Run completionSteps.
      completionSteps();

      // 7. Return.
      return;
    } else {
      // 11. Otherwise:

      // 1. Let document be the result of loading a document given navigationParams, sourceSnapshotParams, and entry's document state's initiator origin.
      const document = loadDocument(
        navigationParams as any,
        sourceSnapshotParams,
        entry.documentState.initiatorOrigin!,
      );

      // 2. If document is null,
      if (!document) {
        // then run completionSteps and return.
        completionSteps();
        return;
      }

      // 3. Set entry's document state's document to document.
      entry.documentState.document = document;

      // 4. Set entry's document state's origin to document's origin.
      entry.documentState.origin = DOM.$(document).origin;

      // 5. If document's URL requires storing the policy container in history, then set entry's document state's history policy container to navigationParams's policy container.
    }

    // 12. If entry's document state's request referrer is "client", then set it to request's referrer.

    // 13. If entry's document state's document is not null, then set entry's document state's ever populated to true.
    if (entry.documentState.document) entry.documentState.everPopulated = true;

    // 14. Run completionSteps.
    completionSteps();
  });
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#create-navigation-params-from-a-srcdoc-resource)
 */
export function createNavigationParamsFromSrcdocResource(
  entry: SessionHistoryEntry,
  navigable: Navigable,
  targetSnapshotParams: TargetSnapshotParams,
  navigationId: string | null,
  navTimingType: NavigationTimingType,
): NavigationParams {
  // 1. Let documentResource be entry's document state's resource.
  const documentResource = entry.documentState.resource;

  if (typeof documentResource !== "string") {
    throw new Error("documentResource is supported only string");
  }
  // 2. Let response be a new response with
  // body: the UTF-8 encoding of documentResource, as a body
  const response = new Response(documentResource, {
    // header list: « (`Content-Type`, `text/html`) »
    headers: { "content-type": "text/html" },
  });
  // TODO
  // URL: about:srcdoc
  Object.defineProperty(response, "url", {
    value: "about:srcdoc",
  });

  // 3. Let responseOrigin be the result of determining the origin given response's URL, targetSnapshotParams's sandboxing flags, and entry's document state's origin.
  const responseOrigin = determineOrigin(
    new URL(response.url),
    targetSnapshotParams.sandboxingFrags,
    entry.documentState.origin,
  );

  // 4. Let coop be a new cross-origin opener policy.
  const coop = new CrossOriginOpenerPolicy();

  // 5. Let coopEnforcementResult be a new cross-origin opener policy enforcement result with
  const coopEnforcementResult = new CrossOriginOpenerPolicyEnforcementResult({
    // url: response's URL
    url: new URL(response.url),
    // origin: responseOrigin
    origin: responseOrigin,
    // cross-origin opener policy: coop
    crossOriginOpenerPolicy: coop,
  });

  const navigableContainerDocument = containerDocument(navigable);
  // 6. Let policyContainer be the result of determining navigation params policy container given response's URL, entry's document state's history policy container, null, navigable's container document's policy container, and null.
  const policyContainer = determineNavigationParamsPolicyContainer(
    new URL(response.url),
    entry.documentState.historyPolicyContainer,
    null,
    navigableContainerDocument && $(navigableContainerDocument).policyContainer,
    null,
  );

  // 7. Return a new navigation params, with
  return {
    // id: navigationId
    id: navigationId,
    // navigable: navigable,
    navigable,
    // request: null
    request: null,
    // response: response
    response,
    // fetch controller: null
    fetchController: null,
    // commit early hints: null
    commitEarlyHints: null,
    // COOP enforcement result: coopEnforcementResult
    COOPEnforcementResult: coopEnforcementResult,
    // reserved environment: null
    reservedEnvironment: null,
    // origin: responseOrigin
    origin: responseOrigin,
    // policy container: policyContainer
    policyContainer,
    // final sandboxing flag set: targetSnapshotParams's sandboxing flags
    finalSandboxingFlagSet: targetSnapshotParams.sandboxingFrags,
    // cross-origin opener policy: coop
    crossOriginOpenerPolicy: coop,
    // navigation timing type: navTimingType
    navigationTimingType: navTimingType,
    // about base URL: entry's document state's about base URL
    aboutBaseURL: entry.documentState.aboutBaseURL,
  };
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#create-navigation-params-by-fetching)
 */
// 1. Assert: this is running in parallel.
export async function createNavigationParamsByFetching(
  entry: SessionHistoryEntry,
  navigable: Navigable,
  sourceSnapshotParams: SourceSnapshotParams,
  targetSnapshotParams: TargetSnapshotParams,
  cspNavigationType: string,
  navigationId: string | null,
  navTimingType: NavigationTimingType,
): Promise<NavigationParams | NonFetchSchemeNavigationParams | null> {
  // 2. Let documentResource be entry's document state's resource.
  const documentResource = entry.documentState.resource;

  // 3. Let request be a new request, with
  const request = new Request(entry.URL, { // url: entry's URL
    // credentials mode: "include"
    credentials: "include",
    // redirect mode: "manual"
    redirect: "manual",
    // mode: "navigate"
    mode: "navigate",
    // referrer: entry's document state's request referrer
    referrer: entry.documentState.requestReferrer as any,
    // referrer policy: entry's document state's request referrer policy
    referrerPolicy: entry.documentState.requestReferrerPolicy,
  });
  const internals = new RequestInternals({
    URL: entry.URL,
    // client: sourceSnapshotParams's fetch client
    client: sourceSnapshotParams.fetchClient as any,
  });
  // use-URL-credentials flag: set
  internals.useCORSPreflightFlag = true;

  // destination: "document"
  // replaces client id: navigable's active document's relevant settings object's id
  internalSlots.extends(request, internals);

  // 4. If documentResource is a POST resource, then:
  if (documentResource && typeof documentResource === "object") {
    // 1. Set request's method to `POST`.

    // 2. Set request's body to documentResource's request body.

    // 3. Set `Content-Type` to documentResource's request content-type in request's header list.
  }

  // 5. If entry's document state's reload pending is true, then set request's reload-navigation flag.
  if (entry.documentState.reloadPending) {}
  // 6. Otherwise, if entry's document state's ever populated is true, then set request's history-navigation flag.
  else if (entry.documentState.everPopulated) {}

  // 7. If sourceSnapshotParams's has transient activation is true, then set request's user-activation to true.
  if (sourceSnapshotParams.hasTransientActivation) {}

  // 8. If navigable's container is non-null:
  if (container(navigable)) {
    // 1. If the navigable's container has a browsing context scope origin, then set request's origin to that browsing context scope origin.

    // 2. Set request's destination to navigable's container's local name.

    // 3. If sourceSnapshotParams's fetch client is navigable's container document's relevant settings object, then set request's initiator type to navigable's container's local name.
  }

  // 9. Let response be null.
  let response: Response | null = null;

  // 10. Let responseOrigin be null.
  let responseOrigin: Origin | null = null;

  // 11. Let fetchController be null.
  let fetchController: FetchController | null = null;

  const navigableActiveDocument = activeDocument(navigable)!; // TODO
  const navigableActiveDocumentOrigin = DOM.$(navigableActiveDocument).origin;
  // 12. Let coopEnforcementResult be a new cross-origin opener policy enforcement result, with
  const coopEnforcementResult = new CrossOriginOpenerPolicyEnforcementResult(
    {
      // url: navigable's active document's URL
      url: DOM.$(navigableActiveDocument).URL,
      // origin: navigable's active document's origin
      origin: navigableActiveDocumentOrigin,
      // cross-origin opener policy: navigable's active document's cross-origin opener policy
      crossOriginOpenerPolicy:
        $(navigableActiveDocument).crossOriginOpenerPolicy,
    },
  );
  // current context is navigation source: true if navigable's active document's origin is same origin with entry's document state's initiator origin otherwise false
  coopEnforcementResult.currentContextIsNavigationSource = sameOrigin(
    navigableActiveDocumentOrigin,
    entry.documentState.initiatorOrigin!,
  );

  // 13. Let finalSandboxFlags be an empty sandboxing flag set.
  const finalSandboxFlags = new Set();

  // 14. Let responsePolicyContainer be null.
  let responsePolicyContainer: PolicyContainer | null = null;

  // 15. Let responseCOOP be a new cross-origin opener policy.
  const responseCOOP = new CrossOriginOpenerPolicy();

  // 16. Let locationURL be null.
  let locationURL: URL | null | false = null;

  // 17. Let currentURL be request's current URL.
  let currentURL = new URL(request.url); // TODO

  // 18. Let commitEarlyHints be null.
  let commitEarlyHints = null;

  // 19. While true:
  while (true) {
    const reservedClient = $(request).reservedClient;

    // 1. If request's reserved client is not null and currentURL's origin is not the same as request's reserved client's creation URL's origin, then:
    if (
      reservedClient &&
      !sameOrigin(origin(currentURL), origin(reservedClient.creationURL))
    ) {
      // 1. Run the environment discarding steps for request's reserved client.

      // 2. Set request's reserved client to null.
      $(request).reservedClient = null;

      // 3. Set commitEarlyHints to null.
      commitEarlyHints = null;
    }

    // 2. If request's reserved client is null, then:
    if (!reservedClient) {
      // 1. Let topLevelCreationURL be currentURL.
      let topLevelCreationURL = currentURL;

      // 2. Let topLevelOrigin be null.
      let topLevelOrigin = null;

      // 3. If navigable is not a top-level traversable, then:
      if (!isTopLevelTraversable(navigable)) {
        // 1. Let parentEnvironment be navigable's parent's active document's relevant settings object.
        const parentEnvironment = activeDocument(navigable.parent!);

        // 2. Set topLevelCreationURL to parentEnvironment's top-level creation URL.
        // topLevelCreationURL = DOM.$(parentEnvironment!);

        // 3. Set topLevelOrigin to parentEnvironment's top-level origin.
        topLevelOrigin = parentEnvironment;

        // 4. Set request's reserved client to a new environment whose id is a unique opaque string, target browsing context is navigable's active browsing context, creation URL is currentURL, top-level creation URL is topLevelCreationURL, and top-level origin is topLevelOrigin.
      }
    }

    // 3. If the result of should navigation request of type be blocked by Content Security Policy? given request and cspNavigationType is "Blocked", then set response to a network error and break. [CSP]

    // 4. Set response to null.
    response = null;

    // 5. If fetchController is null,
    if (!fetchController) {
      // Let processEarlyHintsResponse be the following algorithm given a response earlyResponse:
      const processEarlyHintsResponse = (earlyResponse: Response) => {
        // 1. If commitEarlyHints is null, then set commitEarlyHints to the result of processing early hint headers given earlyResponse and request's reserved client.
      };

      // Let processResponse be the following algorithm given a response fetchedResponse:
      const processResponse = (fetchedResponse: Response): void => {
        // 1. Set response to fetchedResponse.
        response = fetchedResponse;
      };

      // then set fetchController to the result of fetching request, with processEarlyHintsResponse set to processEarlyHintsResponse as defined below, processResponse set to processResponse as defined below, and useParallelQueue set to true.
      fetchController = await fetch(
        request,
        undefined,
        undefined,
        processEarlyHintsResponse,
        processResponse,
        undefined,
        undefined,
        true,
      );

      // 6. Otherwise, process the next manual redirect for fetchController.
    } else processNextManualRedirect(fetchController as any);

    // 7. Wait until either response is non-null, or navigable's ongoing navigation changes to no longer equal navigationId.
    await waitUntil(() => !!response);

    // If the latter condition occurs, then abort fetchController, and return.

    // Otherwise, proceed onward.

    // 8. If request's body is null, then set entry's document state's resource to null.

    // 9. Set responsePolicyContainer to the result of creating a policy container from a fetch response given response and request's reserved client.

    // 10. Set finalSandboxFlags to the union of targetSnapshotParams's sandboxing flags and responsePolicyContainer's CSP list's CSP-derived sandboxing flags.

    // 11. Set responseOrigin to the result of determining the origin given response's URL, finalSandboxFlags, and entry's document state's initiator origin.

    // 12. If navigable is a top-level traversable, then:

    // 1. Set responseCOOP to the result of obtaining a cross-origin opener policy given response and request's reserved client.

    // 2. Set coopEnforcementResult to the result of enforcing the response's cross-origin opener policy given navigable's active browsing context, response's URL, responseOrigin, responseCOOP, coopEnforcementResult and request's referrer.

    // 3. If finalSandboxFlags is not empty and responseCOOP's value is not "unsafe-none", then set response to an appropriate network error and break.

    // 13. If response is not a network error, navigable is a child navigable, and the result of performing a cross-origin resource policy check with navigable's container document's origin, navigable's container document's relevant settings object, request's destination, response, and true is blocked, then set response to a network error and break.

    // 14. Set locationURL to response's location URL given currentURL's fragment.
    locationURL = getLocationURL(response!, currentURL.hash);

    // 15. If locationURL is failure or null, then break.
    if (!locationURL) break;

    // 16. Assert: locationURL is a URL.

    // 17. Set entry's classic history API state to StructuredSerializeForStorage(null).
    entry.classicHistoryAPIState = StructuredSerializeForStorage(null);

    // 18. Let oldDocState be entry's document state.
    const oldDocState = entry.documentState;

    const documentState = new DocumentState();
    // history policy container: a clone of the oldDocState's history policy container if it is non-null; null otherwise
    documentState.historyPolicyContainer = oldDocState.historyPolicyContainer &&
      clonePolicyContainer(oldDocState.historyPolicyContainer);
    // request referrer: oldDocState's request referrer
    documentState.requestReferrer = oldDocState.requestReferrer;
    // request referrer policy: oldDocState's request referrer policy
    documentState.requestReferrerPolicy = oldDocState.requestReferrerPolicy;
    // initiator origin: oldDocState's initiator origin
    documentState.initiatorOrigin = oldDocState.initiatorOrigin;
    // origin: oldDocState's origin
    documentState.origin = oldDocState.origin;
    // about base URL: oldDocState's about base URL
    documentState.aboutBaseURL = oldDocState.aboutBaseURL;
    // resource: oldDocState's resource
    documentState.resource = oldDocState.resource;
    // ever populated: oldDocState's ever populated
    documentState.everPopulated = oldDocState.everPopulated;
    // navigable target name: oldDocState's navigable target name
    documentState.navigableTargetName = oldDocState.navigableTargetName;

    // 19. Set entry's document state to a new document state, with
    entry.documentState = documentState;

    // 20. If locationURL's scheme is not an HTTP(S) scheme, then:
    if (
      isHTTPScheme(
        locationURL.protocol.slice(0, locationURL.protocol.length - 1),
      )
    ) {
      // 1. Set entry's document state's resource to null.
      entry.documentState.resource = null;

      // 2. Break.
      break;
    }

    // 21. Set currentURL to locationURL.
    currentURL = locationURL;

    // 22. Set entry's URL to currentURL.
    entry.URL = currentURL;
  }

  // 20. If locationURL is a URL whose scheme is not a fetch scheme, then return a new non-fetch scheme navigation params, with
  // id: navigationId
  // navigable: navigable
  // URL: locationURL
  // target snapshot sandboxing flags: targetSnapshotParams's sandboxing flags
  // source snapshot has transient activation: sourceSnapshotParams's has transient activation
  // initiator origin: responseOrigin
  // navigation timing type: navTimingType

  // 21. If any of the following are true:
  if (
    // - response is a network error;
    isNetworkError(response!)
    // - locationURL is failure; or
    // !locationURL
    // - locationURL is a URL whose scheme is a fetch scheme,
  ) {
    // then return null.
    return null;
  }

  // 22. Assert: locationURL is null and response is not a network error.

  // 23. Let resultPolicyContainer be the result of determining navigation params policy container given response's URL, entry's document state's history policy container, sourceSnapshotParams's source policy container, null, and responsePolicyContainer.
  const resultPolicyContainer = determineNavigationParamsPolicyContainer(
    $(response!).url!,
    entry.documentState.historyPolicyContainer,
    sourceSnapshotParams.sourcePolicyContainer,
    null,
    responsePolicyContainer,
  );

  // 24. If navigable's container is an iframe, and response's timing allow passed flag is set, then set container's pending resource-timing start time to null.

  // 25. Return a new navigation params, with
  return {
    // id: navigationId
    id: navigationId,
    // navigable: navigable,
    navigable,
    // request: request
    request,
    // response: response
    response: response!,
    // fetch controller: fetchController
    fetchController,
    // commit early hints: commitEarlyHints
    commitEarlyHints: commitEarlyHints,
    // cross-origin opener policy: responseCOOP
    crossOriginOpenerPolicy: responseCOOP,
    // reserved environment: request's reserved client
    reservedEnvironment: {}, // TODO
    // origin: responseOrigin
    origin: responseOrigin!,
    // policy container: resultPolicyContainer
    policyContainer: resultPolicyContainer,
    // final sandboxing flag set: finalSandboxFlags
    finalSandboxingFlagSet: finalSandboxFlags,
    // COOP enforcement result: coopEnforcementResult
    COOPEnforcementResult: coopEnforcementResult,
    // navigation timing type: navTimingType
    navigationTimingType: navTimingType,
    // about base URL: entry's document state's about base URL
    aboutBaseURL: entry.documentState.aboutBaseURL,
  };
}

async function waitUntil(condition: () => boolean) {
  while (!condition()) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
