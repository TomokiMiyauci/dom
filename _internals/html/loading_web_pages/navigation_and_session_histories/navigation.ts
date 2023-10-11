import { List } from "../../../infra/data_structures/list.ts";
import {
  CrossOriginOpenerPolicy,
  CrossOriginOpenerPolicyEnforcementResult,
  determineNavigationParamsPolicyContainer,
  Origin,
  PolicyContainer,
} from "../supporting_concepts.ts";
import {
  activeDocument,
  containerDocument,
  Navigable,
  targetName,
} from "../infrastructure_for_sequences_of_documents/navigable.ts";
import { $ } from "../../../../internal.ts";
import { documentBaseURL, matchAboutBlank } from "../../infra/url.ts";
import { equalsURL } from "../../../url/url.ts";
import {
  displayInlineContent,
  loadHTMLDocument,
  loadTextDocument,
  loadXMLDocument,
} from "../document_lifecycle.ts";
import { FetchController } from "../../../fetch/infrastructure.ts";
import { informNavigationAPIAboutAbortingNavigation } from "../navigation_history_entry_utils.ts";
import {
  DocumentState,
  POSTResource,
  SessionHistoryEntry,
} from "./session_history.ts";
import { attemptPopulateHistoryEntryDocument } from "./populating_session_history_entry.ts";
import { determineOrigin } from "../infrastructure_for_sequences_of_documents/browsing_context.ts";
import { DOMExceptionName } from "../../../webidl/exception.ts";
import { parseMediaType } from "../../../../deps.ts";
import {
  isJSONMIMEType,
  JavaScriptMIMETypes,
} from "../../../mimesniff/mod.ts";
import { URLSerializer } from "../../../url/serializer.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#source-snapshot-params)
 */
export interface SourceSnapshotParams {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#source-snapshot-params-activation)
   */
  hasTransientActivation: boolean;

  sandboxingFlags: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#source-snapshot-params-download)
   */
  allowsDownloading: boolean;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#source-snapshot-params-client)
   */
  fetchClient: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#source-snapshot-params-policy-container)
   */
  sourcePolicyContainer: PolicyContainer;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#snapshotting-source-snapshot-params)
 */
export function snapshotSourceSnapshotParams(
  sourceDocument: Document,
): SourceSnapshotParams {
  // has transient activation: true if sourceDocument's relevant global object has transient activation; otherwise false
  // sandboxing flags: sourceDocument's active sandboxing flag set
  // allows downloading: false if sourceDocument's active sandboxing flag set has the sandboxed downloads browsing context flag set; otherwise true
  // fetch client: sourceDocument's relevant settings object
  // TODO
  return {
    // source policy container: sourceDocument's policy container
    hasTransientActivation: false,
    sandboxingFlags: {},
    allowsDownloading: false,
    sourcePolicyContainer: $(sourceDocument).policyContainer,
    fetchClient: {},
  };
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#target-snapshot-params)
 */
export interface TargetSnapshotParams {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#target-snapshot-params-sandbox)
   */
  sandboxingFrags: unknown;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#snapshotting-target-snapshot-params)
 */
export function snapshotTargetSnapshotParams(
  targetNavigable: Navigable,
): TargetSnapshotParams {
  // return a new target snapshot params with sandboxing flags set to the result of determining the creation sandboxing flags given targetNavigable's active browsing context and targetNavigable's container.
  return { sandboxingFrags: {} };
}

export interface NavigationParams {
  id: string | null;

  navigable: Navigable;

  request: Request | null;

  response: Response;

  fetchController: FetchController | null;

  commitEarlyHints: unknown;

  COOPEnforcementResult: unknown;

  reservedEnvironment: unknown;

  origin: Origin;

  policyContainer: PolicyContainer;

  finalSandboxingFlagSet: unknown;

  crossOriginOpenerPolicy: CrossOriginOpenerPolicy;

  navigationTimingType: NavigationTimingType;

  aboutBaseURL: URL | null;
}

export enum NavigationHistoryBehavior {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigationhistorybehavior-push)
   */
  Push = "push",

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigationhistorybehavior-replace)
   */
  Replace = "replace",

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigationhistorybehavior-auto)
   */
  Auto = "auto",
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#user-navigation-involvement)
 */
export enum UserNavigationInvolvement {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#uni-browser-ui)
   */
  BrowserUI = "browser UI",

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#uni-activation)
   */
  Activation = "activation",

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#uni-none)
   */
  None = "none",
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#event-uni)
 */
export function userNavigationInvolvement(
  event: Event,
): UserNavigationInvolvement {
  // 1. Assert: this algorithm is being called as part of an activation behavior definition.

  // 2. Assert: event's type is "click".

  // 3. If event's isTrusted is initialized to true, then return "activation".
  if (event.isTrusted) return UserNavigationInvolvement.Activation;

  // 4. Return "none".
  return UserNavigationInvolvement.None;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate)
 */
export async function navigate(
  navigable: Navigable,
  url: URL,
  sourceDocument: Document,
  postResource?: POSTResource,
  documentResource: string | null = null,
  response: Response | null = null,
  exceptionsEnabled = false,
  historyHandling: NavigationHistoryBehavior = NavigationHistoryBehavior.Auto,
  navigationAPIState: unknown | null = null,
  formDataEntryList: List<Entry> | null = null,
  referrerPolicy: ReferrerPolicy = "",
  userInvolvement: UserNavigationInvolvement = UserNavigationInvolvement.None,
): Promise<void> {
  // 1. Let cspNavigationType be "form-submission" if formDataEntryList is non-null; otherwise "other".
  const cspNavigationType = formDataEntryList ? "form-submission" : "other";

  // 2. Let sourceSnapshotParams be the result of snapshotting source snapshot params given sourceDocument.
  const sourceSnapshotParams = snapshotSourceSnapshotParams(sourceDocument);

  // 3. Let initiatorOriginSnapshot be sourceDocument's origin.
  const initiatorOriginSnapshot = $(sourceDocument).origin;

  // 4. Let initiatorBaseURLSnapshot be sourceDocument's document base URL.
  const initiatorBaseURLSnapshot = documentBaseURL(sourceDocument);

  // 5. If sourceDocument's node navigable is not allowed by sandboxing to navigate navigable given and sourceSnapshotParams, then:
  if (false) {
    // 1. If exceptionsEnabled is true, then throw a "SecurityError" DOMException.
    if (exceptionsEnabled) {
      throw new DOMException("<message>", DOMExceptionName.SecurityError);
    }

    // 2. Return.
    return;
  }

  // 6. Let navigationId be the result of generating a random UUID. [WEBCRYPTO]
  const navigationId = crypto.randomUUID(); // TODO

  // 7. If the surrounding agent is equal to navigable's active document's relevant agent, then continue these steps. Otherwise, queue a global task on the navigation and traversal task source given navigable's active window to continue these steps.

  // 8. If navigable's active document's unload counter is greater than 0, then invoke WebDriver BiDi navigation failed with a WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is url, and return.

  // 9. If historyHandling is "auto", then:
  if (historyHandling === NavigationHistoryBehavior.Auto) {
    const navigableActiveDocument = activeDocument(navigable);
    // 1. If url equals navigable's active document's URL, and initiatorOriginSnapshot is same origin with targetNavigable's active document's origin, then set historyHandling to "replace".
    if (
      navigableActiveDocument &&
      equalsURL(url, $(navigableActiveDocument).URL) // TODO
    ) historyHandling = NavigationHistoryBehavior.Replace;
    // 2. Otherwise, set historyHandling to "push".
    else historyHandling = NavigationHistoryBehavior.Push;
  }

  // 10. If the navigation must be a replace given url and navigable's active document, then set historyHandling to "replace".

  // 11. If all of the following are true:
  if (
    // - documentResource is null;
    documentResource === null &&
    // - response is null;
    response === null &&
    // - url equals navigable's active session history entry's URL with exclude fragments set to true; and
    equalsURL(url, navigable.activeSessionHistoryEntry.URL, true) &&
    // - url's fragment is non-null,
    !url.hash // TODO use internal fragment
  ) {
    // 1. Navigate to a fragment given navigable, url, historyHandling, userInvolvement, navigationAPIState, and navigationId.

    // 2. Return.
    return;
  }

  // 12. If navigable's parent is non-null, then set navigable's is delaying load events to true.
  if (navigable.parent) navigable.isDelayingLoadEvents = true;

  // 13. Let targetBrowsingContext be navigable's active browsing context.

  // 14. Let targetSnapshotParams be the result of snapshotting target snapshot params given navigable.
  const targetSnapshotParams = snapshotTargetSnapshotParams(navigable);

  // 15. Invoke WebDriver BiDi navigation started with targetBrowsingContext, and a new WebDriver BiDi navigation status whose id is navigationId, status is "pending", and url is url.

  // 16. If navigable's ongoing navigation is "traversal", then:
  if (navigable.ongoingNavigation === "traversal") {
    // 1. Invoke WebDriver BiDi navigation failed with targetBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is url.

    // 2. Return.
    return;
  }

  // 17. Set the ongoing navigation for navigable to navigationId.
  navigable.ongoingNavigation = navigationId;

  // 18. If url's scheme is "javascript", then:
  if (url.protocol === "javascript:") { // TODO use internal scheme
    // 1. Queue a global task on the navigation and traversal task source given navigable's active window to navigate to a javascript: URL given navigable, url, historyHandling, initiatorOriginSnapshot, and cspNavigationType.
    queueMicrotask(() => {
      navigateJavaScriptURL(
        navigable,
        url,
        historyHandling,
        initiatorOriginSnapshot,
        cspNavigationType,
      );
    });

    // 2. Return.
    return;
  }

  // 19. If all of the following are true:
  if (
    // - userInvolvement is not "browser UI";
    userInvolvement !== UserNavigationInvolvement.BrowserUI
    // - navigable's active document's origin is same origin-domain with sourceDocument's origin;
    // - navigable's active document's is initial about:blank is false; and
    // - url's scheme is a fetch scheme,
    // then:
  ) {
    // 1. Let navigation be navigable's active window's navigation API.

    // 2. Let entryListForFiring be formDataEntryList if documentResource is a POST resource; otherwise, null.

    // 3. Let navigationAPIStateForFiring be navigationAPIState if navigationAPIState is not null; otherwise, StructuredSerializeForStorage(undefined).

    // 4. Let continue be the result of firing a push/replace/reload navigate event at navigation with navigationType set to historyHandling, isSameDocument set to false, userInvolvement set to userInvolvement, formDataEntryList set to entryListForFiring, destinationURL set to url, and navigationAPIState set to navigationAPIStateForFiring.

    // 5. If continue is false, then return.
  }

  // 20. In parallel, run these steps:

  // 1. Let unloadPromptCanceled be the result of checking if unloading is canceled for navigable's active document's inclusive descendant navigables.

  // 2. If unloadPromptCanceled is true, or navigable's ongoing navigation is no longer navigationId, then:

  // 1. Invoke WebDriver BiDi navigation failed with targetBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is url.

  // 2. Abort these steps.

  // 3. Queue a global task on the navigation and traversal task source given navigable's active window to abort navigable's active document.

  // 4. Let documentState be a new document state with
  const documentState = new DocumentState();
  documentState.requestReferrerPolicy = referrerPolicy;
  // request referrer policy: referrerPolicy
  documentState.origin = referrerPolicy;
  // initiator origin: initiatorOriginSnapshot
  documentState.initiatorOrigin = initiatorOriginSnapshot;
  // resource: documentResource
  documentState.resource = documentResource;
  // navigable target name: navigable's target name
  documentState.navigableTargetName = targetName(navigable);

  // 5. If url matches about:blank or is about:srcdoc, then:
  if (matchAboutBlank(url)) { // TODO
    // 1. Set documentState's origin to initiatorOriginSnapshot.
    documentState.origin = initiatorOriginSnapshot;

    // 2. Set documentState's about base URL to initiatorBaseURLSnapshot.
    documentState.aboutBaseURL = initiatorBaseURLSnapshot;
  }

  // 6. Let historyEntry be a new session history entry, with its URL set to url and its document state set to documentState.
  const historyEntry = new SessionHistoryEntry({ URL: url, documentState });

  // 7. Let navigationParams be null.
  let navigationParams: NavigationParams | null = null;

  // 8. If response is non-null:
  if (response) {
    // 1. Let policyContainer be the result of determining navigation params policy container given response's URL, null, a clone of the sourceDocument's policy container, navigable's container document's policy container, and null.
    const policyContainer = determineNavigationParamsPolicyContainer(
      $(response).url!,
      null,
      $(sourceDocument).policyContainer,
      $(containerDocument(navigable)!).policyContainer,
      null,
    );

    // 2. Let finalSandboxFlags be the union of targetSnapshotParams's sandboxing flags and policyContainer's CSP list's CSP-derived sandboxing flags.
    const finalSandboxFlags = {}; // TODO

    // 3. Let responseOrigin be the result of determining the origin given response's URL, finalSandboxFlags, and documentState's initiator origin.
    const responseOrigin = determineOrigin(
      $(response).url,
      finalSandboxFlags,
      documentState.initiatorOrigin,
    );

    // 4. Let coop be a new cross-origin opener policy.
    const coop = new CrossOriginOpenerPolicy();

    // 5. Let coopEnforcementResult be a new cross-origin opener policy enforcement result with
    const coopEnforcementResult = new CrossOriginOpenerPolicyEnforcementResult({
      // url: response's URL
      url: $(response).url!,
      // origin: responseOrigin
      origin: responseOrigin,
      // cross-origin opener policy: coop
      crossOriginOpenerPolicy: coop,
    });

    // 6. Set navigationParams to a new navigation params, with
    navigationParams = {
      // id: navigationId
      id: navigationId,
      // navigable: navigable
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
      // final sandboxing flag set: finalSandboxFlags
      finalSandboxingFlagSet: finalSandboxFlags,
      // cross-origin opener policy: coop
      crossOriginOpenerPolicy: coop,
      // navigation timing type: "navigate"
      navigationTimingType: "navigate",
      // about base URL: documentState's about base URL
      aboutBaseURL: documentState.aboutBaseURL,
    };
  }

  // 9. Attempt to populate the history entry's document for historyEntry, given navigable, "navigate", sourceSnapshotParams, targetSnapshotParams, navigationId, navigationParams, cspNavigationType, with allowPOST set to true and completionSteps set to the following step:
  await attemptPopulateHistoryEntryDocument(
    historyEntry,
    navigable,
    "navigate",
    sourceSnapshotParams,
    targetSnapshotParams,
    navigationId,
    navigationParams,
    cspNavigationType,
    true,
    () => {
      // Non-standard process
      navigable.activeSessionHistoryEntry = historyEntry;
      // 1. Append session history traversal steps to navigable's traversable to finalize a cross-document navigation given navigable, historyHandling, and historyEntry.
      // appendSessionHistoryTraversalSteps(
      //   traversableNavigable(navigable),
      //   () =>
      //     finalizeCrossDocumentNavigation(
      //       navigable,
      //       historyHandling,
      //       historyEntry,
      //     ),
      // );
    },
  );
}

export function finalizeCrossDocumentNavigation(
  navigable: Navigable,
  historyHandling: NavigationHistoryBehavior,
  historyEntry: SessionHistoryEntry,
): void {
  // 1. Assert: this is running on navigable's traversable navigable's session history traversal queue.

  // 2. Set navigable's is delaying load events to false.

  // 3. If historyEntry's document is null, then return.

  // 4. If all of the following are true:
  // - navigable's parent is null;
  // - historyEntry's document's browsing context is not an auxiliary browsing context whose opener browsing context is non-null; and
  // - historyEntry's document's origin is not navigable's active document's origin,

  // then set historyEntry's document state's navigable target name to the empty string.

  // 5. Let entryToReplace be navigable's active session history entry if historyHandling is "replace", otherwise null.

  // 6. Let traversable be navigable's traversable navigable.

  // 7. Let targetStep be null.

  // 8. Let targetEntries be the result of getting session history entries for navigable.

  // 9. If entryToReplace is null, then:

  // 1. Clear the forward session history of traversable.

  // 2. Set targetStep to traversable's current session history step + 1.

  // 3. Set historyEntry's step to targetStep.

  // 4. Append historyEntry to targetEntries.

  // Otherwise:

  // 1. Replace entryToReplace with historyEntry in targetEntries.

  // 2. Set historyEntry's step to entryToReplace's step.

  // 3. If historyEntry's document state's origin is same origin with entryToReplace's document state's origin, then set historyEntry's navigation API key to entryToReplace's navigation API key.

  // 4. Set targetStep to traversable's current session history step.

  // 10. Apply the push/replace history step targetStep to traversable.
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate-to-a-javascript:-url)
 */
export function navigateJavaScriptURL(
  targetNavigable: Navigable,
  url: URL,
  historyHandling: NavigationHistoryBehavior,
  initiatorOrigin: Origin,
  cspNavigationType: string,
): void {
  // 6. Let newDocument be the result of evaluating a javascript: URL given targetNavigable, url, and initiatorOrigin.
  const newDocument = evaluateJavaScriptURL(
    targetNavigable,
    url,
    initiatorOrigin,
  );

  // 7. If newDocument is null, then return.
  if (!newDocument) return;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#evaluate-a-javascript:-url)
 */
export function evaluateJavaScriptURL(
  targetNavigable: Navigable,
  url: URL,
  newDocumentOrigin: Origin,
): Document | null {
  // 1. Let urlString be the result of running the URL serializer on url.
  const urlString = URLSerializer.serialize(url);

  // 2. Let encodedScriptSource be the result of removing the leading "javascript:" from urlString.
  const encodedScriptSource = urlString.replace(/^javascript:/, "");

  // 3. Let scriptSource be the UTF-8 decoding of the percent-decoding of encodedScriptSource.
  // TODO
  const scriptSource = encodedScriptSource;

  // Non-standard process
  eval?.(scriptSource);

  // // 4. Let settings be targetNavigable's active document's relevant settings object.

  // // 5. Let baseURL be settings's API base URL.

  // // 6. Let script be the result of creating a classic script given scriptSource, settings, baseURL, and the default classic script fetch options.
  // const script = createClassicScript(scriptSource, {} as any, baseURL, {});

  // // 7. Let evaluationStatus be the result of running the classic script script.
  // const evaluationStatus = runClassicScript(script);

  // ---

  // 17. Return the result of loading an HTML document given navigationParams.
  return null;
  // return loadHTMLDocument(navigationParams);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#loading-a-document)
 */
export function loadDocument(
  navigationParams: NavigationParams,
  sourceSnapshotParams: unknown,
  initiatorOrigin: Origin,
): Document | null {
  const contentType = navigationParams.response.headers.get("content-type") ??
    "";
  // 1. Let type be the computed type of navigationParams's response.
  const [type] = parseMediaType(contentType);

  // 2. If the user agent has been configured to process resources of the given type using some mechanism other than rendering the content in a navigable, then skip this step. Otherwise, if the type is one of the following types:
  if (type === "text/html") return loadHTMLDocument(navigationParams);
  if (type.endsWith("+xml") || type === "application/xml") {
    return loadXMLDocument(navigationParams, type);
  }

  if (
    JavaScriptMIMETypes.has(type) ||
    isJSONMIMEType(type) ||
    type === "text/css" ||
    type === "text/plain" ||
    type === "text/vtt"
  ) {
    // Return the result of loading a text document given navigationParams and type.
    return loadTextDocument(navigationParams, type);
  }

  return null;
}

type Entry = [name: string, value: string];

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-navigation-params)
 */
export interface NonFetchSchemeNavigationParams {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-id)
   */
  id: string | null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-navigable)
   */
  navigable: Navigable;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-url)
   */
  URL: URL;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-target-sandbox)
   */
  targetSnapshotSandboxingFlags: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-source-activation)
   */
  sourceSnapshotHasTransientActivation: boolean;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-initiator-origin)
   */
  initiatorOrigin: Origin;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#non-fetch-scheme-params-nav-timing-type)
   */
  navigationTimingType: NavigationTimingType;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#attempt-to-create-a-non-fetch-scheme-document)
 */
export function attemptToCreateNonFetchSchemeDocument(
  navigationParams: NonFetchSchemeNavigationParams,
): Document | null {
  // 1. Let url be navigationParams's URL.
  const url = navigationParams.URL;

  // 2. Let navigable be navigationParams's navigable.
  const navigable = navigationParams.navigable;

  // 3. If url is to be handled using a mechanism that does not affect navigable, e.g., because url's scheme is handled externally, then:

  // 1. Hand-off to external software given url, navigable, navigationParams's target snapshot sandboxing flags, navigationParams's source snapshot has transient activation, and navigationParams's initiator origin.

  // 2. Return null.

  // 4. Handle url by displaying some sort of inline content, e.g., an error message because the specified scheme is not one of the supported protocols, or an inline prompt to allow the user to select a registered handler for the given scheme.
  // Return the result of displaying the inline content given navigable, navigationParams's id, and navigationParams's navigation timing type.
  return displayInlineContent(
    navigable,
    navigationParams.id,
    navigationParams.navigationTimingType,
  );
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#set-the-ongoing-navigation)
 */
export function setOngoingNavigation(
  navigable: Navigable,
  newValue: string | null,
): void {
  // 1. If navigable's ongoing navigation is equal to newValue, then return.
  if (navigable.ongoingNavigation === newValue) return;

  // 2. Inform the navigation API about aborting navigation given navigable.
  informNavigationAPIAboutAbortingNavigation(navigable);

  // 3. Set navigable's ongoing navigation to newValue.
  navigable.ongoingNavigation = newValue;
}
