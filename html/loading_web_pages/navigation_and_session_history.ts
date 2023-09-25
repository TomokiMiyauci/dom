import { List } from "../../infra/data_structures/list.ts";
import {
  clonePolicyContainer,
  CrossOriginOpenerPolicy,
  CrossOriginOpenerPolicyEnforcementResult,
  determineNavigationParamsPolicyContainer,
  Origin,
  PolicyContainer,
  sameOrigin,
} from "./supporting_concepts.ts";
import {
  activeBrowsingContext,
  activeDocument,
  activeWindow,
  container,
  containerDocument,
  Navigable,
  TraversableNavigable,
  traversableNavigable,
} from "./infrastructure_for_sequences_of_documents/navigable.ts";
import { StructuredSerializeForStorage } from "../infra/safe_passing_of_structured_data.ts";
import * as DOM from "../../internal.ts";
import { documentBaseURL } from "../infra/url.ts";
import { equalsURL } from "../../url/url.ts";
import {
  displayInlineContent,
  loadHTMLDocument,
} from "./document_lifecycle.ts";
import { $ } from "../internal.ts";
import {
  determineOrigin,
} from "./infrastructure_for_sequences_of_documents/browsing_context.ts";
import {
  isFetchScheme,
  isHTTPScheme,
  locationURL as getLocationURL,
} from "../../fetch/infrastructure.ts";
import { queueGlobalTask } from "../web_application_apis/scripting.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import { informNavigationAPIAboutAbortingNavigation } from "./navigation_history_entry_utils.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#session-history-entry)
 */
export class SessionHistoryEntry {
  step: number | "pending" = "pending";
  URL: URL;
  documentState: DocumentState;
  classicHistoryAPIState = StructuredSerializeForStorage(null);
  navigationAPIState = StructuredSerializeForStorage(undefined);
  navigationAPIKey = crypto.randomUUID(); // TODO use generating random UUID
  navigationAPIID = crypto.randomUUID(); // TODO use generating random UUID
  scrollRestorationMode: "auto" = "auto";
  scrollPositionData: unknown;
  persistedUserState: unknown | null = null;

  constructor(
    { URL, documentState }: Pick<SessionHistoryEntry, "URL" | "documentState">,
  ) {
    this.URL = URL;
    this.documentState = documentState;
  }
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-2)
 */
export class DocumentState {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-document)
   */
  document: Document | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-history-policy-container)
   */
  historyPolicyContainer: PolicyContainer | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-request-referrer)
   */
  requestReferrer: "no-referrer" | "client" | URL = "client";

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-request-referrer-policy)
   */
  requestReferrerPolicy: ReferrerPolicy = "strict-origin-when-cross-origin";

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-initiator-origin)
   */
  initiatorOrigin: Origin | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-origin)
   */
  origin: Origin | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-about-base-url)
   */
  aboutBaseURL: URL | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#nested-history)
   */
  nestedHistories: List<NestedHistory> = new List();

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-resource)
   */
  resource: string | POSTResource | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-reload-pending)
   */
  reloadPending = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-ever-populated)
   */
  everPopulated = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-nav-target-name)
   */
  navigableTargetName = "";
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#post-resource)
 */
export class POSTResource {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#post-resource-request-body)
   */
  requestBody: unknown;

  requestContentType!:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#nested-history)
 */
export class NestedHistory {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#nested-history-id)
   */
  id: unknown;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#nested-history-entries)
   */
  entries: List<SessionHistoryEntry> = new List();
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#session-history-traversal-parallel-queue)
 */
export interface SessionHistoryTraversalParallelQueue {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#session-history-traversal-parallel-queue-algorithm-set)
   */
  algorithmSet: OrderedSet<unknown>;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#tn-append-session-history-traversal-steps)
 */
export function appendSessionHistoryTraversalSteps(
  traversable: TraversableNavigable,
  steps: Function,
): void {
  // append steps to traversable's session history traversal queue's algorithm set.
  traversable.sessionHistoryTraversalQueue.algorithmSet.append(steps);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#starting-a-new-session-history-traversal-parallel-queue)
 */
export function startNewSessionHistoryTraversalParallelQueue(): SessionHistoryTraversalParallelQueue {
  // 1. Let sessionHistoryTraversalQueue be a new session history traversal parallel queue.
  const sessionHistoryTraversalQueue: SessionHistoryTraversalParallelQueue = {
    algorithmSet: new OrderedSet(),
  };

  // 2. Run the following steps in parallel:

  // 1. While true:
  // 1. If sessionHistoryTraversalQueue's algorithm set is empty, then continue.

  // 2. Let steps be the result of dequeuing from sessionHistoryTraversalQueue's algorithm set.

  // 3. Run steps.

  // 3. Return sessionHistoryTraversalQueue.
  return sessionHistoryTraversalQueue;
}

export function getSessionHistoryEntryDocument(
  entry: SessionHistoryEntry,
): Document | null {
  return entry.documentState.document;
}

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

  fetchController: unknown | null;

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
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate)
 */
export function navigate(
  navigable: Navigable,
  url: URL,
  sourceDocument: Document,
  postResource?: POSTResource,
  documentResource: string | null = null,
  response: unknown | null = null,
  exceptionsEnabled = false,
  historyHandling: NavigationHistoryBehavior = NavigationHistoryBehavior.Auto,
  navigationAPIState: unknown | null = null,
  formDataEntryList: List<Entry> | null = null,
  referrerPolicy: ReferrerPolicy = "",
  userInvolvement: UserNavigationInvolvement = UserNavigationInvolvement.None,
): void {
  // 1. Let cspNavigationType be "form-submission" if formDataEntryList is non-null; otherwise "other".
  const cspNavigationType = formDataEntryList ? "form-submission" : "other";

  // 2. Let sourceSnapshotParams be the result of snapshotting source snapshot params given sourceDocument.
  const sourceSnapshotParams = snapshotSourceSnapshotParams(sourceDocument);

  // 3. Let initiatorOriginSnapshot be sourceDocument's origin.
  const initiatorOriginSnapshot = DOM.$(sourceDocument).origin;

  // 4. Let initiatorBaseURLSnapshot be sourceDocument's document base URL.
  const initiatorBaseURLSnapshot = documentBaseURL(sourceDocument);

  // 5. If sourceDocument's node navigable is not allowed by sandboxing to navigate navigable given and sourceSnapshotParams, then:

  // 1. If exceptionsEnabled is true, then throw a "SecurityError" DOMException.

  // 2. Return.

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
      equalsURL(url, DOM.$(navigableActiveDocument).URL) // TODO
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

  // 1. Invoke WebDriver BiDi navigation failed with targetBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is url.

  // 2. Return.

  // 17. Set the ongoing navigation for navigable to navigationId.

  // 18. If url's scheme is "javascript", then:
  if (url.protocol === "javascript") { // TODO use internal scheme
    // 1. Queue a global task on the navigation and traversal task source given navigable's active window to navigate to a javascript: URL given navigable, url, historyHandling, initiatorOriginSnapshot, and cspNavigationType.

    // 2. Return.
    return;
  }

  // 19. If all of the following are true:

  // - userInvolvement is not "browser UI";

  // - navigable's active document's origin is same origin-domain with sourceDocument's origin;

  // - navigable's active document's is initial about:blank is false; and

  // - url's scheme is a fetch scheme,

  // then:

  // 1. Let navigation be navigable's active window's navigation API.

  // 2. Let entryListForFiring be formDataEntryList if documentResource is a POST resource; otherwise, null.

  // 3. Let navigationAPIStateForFiring be navigationAPIState if navigationAPIState is not null; otherwise, StructuredSerializeForStorage(undefined).

  // 4. Let continue be the result of firing a push/replace/reload navigate event at navigation with navigationType set to historyHandling, isSameDocument set to false, userInvolvement set to userInvolvement, formDataEntryList set to entryListForFiring, destinationURL set to url, and navigationAPIState set to navigationAPIStateForFiring.

  // 5. If continue is false, then return.

  // 20. In parallel, run these steps:

  // 1. Let unloadPromptCanceled be the result of checking if unloading is canceled for navigable's active document's inclusive descendant navigables.

  // 2. If unloadPromptCanceled is true, or navigable's ongoing navigation is no longer navigationId, then:

  // 1. Invoke WebDriver BiDi navigation failed with targetBrowsingContext and a new WebDriver BiDi navigation status whose id is navigationId, status is "canceled", and url is url.

  // 2. Abort these steps.

  // 3. Queue a global task on the navigation and traversal task source given navigable's active window to abort navigable's active document.

  // 4. Let documentState be a new document state with
  const documentState = new DocumentState();

  // request referrer policy
  // referrerPolicy
  // initiator origin
  // initiatorOriginSnapshot
  // resource
  // documentResource
  // navigable target name
  // navigable's target name

  // 5. If url matches about:blank or is about:srcdoc, then:

  // 1. Set documentState's origin to initiatorOriginSnapshot.

  // 2. Set documentState's about base URL to initiatorBaseURLSnapshot.

  // 6. Let historyEntry be a new session history entry, with its URL set to url and its document state set to documentState.
  const historyEntry = new SessionHistoryEntry({ URL: url, documentState });

  // 7. Let navigationParams be null.
  let navigationParams = null;

  // 8. If response is non-null:
  if (response) {
    // 1. Let policyContainer be the result of determining navigation params policy container given response's URL, null, a clone of the sourceDocument's policy container, navigable's container document's policy container, and null.

    // 2. Let finalSandboxFlags be the union of targetSnapshotParams's sandboxing flags and policyContainer's CSP list's CSP-derived sandboxing flags.

    // 3. Let responseOrigin be the result of determining the origin given response's URL, finalSandboxFlags, and documentState's initiator origin.

    // 4. Let coop be a new cross-origin opener policy.

    // 5. Let coopEnforcementResult be a new cross-origin opener policy enforcement result with

    // url
    // response's URL
    // origin
    // responseOrigin
    // cross-origin opener policy
    // coop

    // 6. Set navigationParams to a new navigation params, with

    // id
    // navigationId
    // navigable
    // navigable
    // request
    // null
    // response
    // response
    // fetch controller
    // null
    // commit early hints
    // null
    // COOP enforcement result
    // coopEnforcementResult
    // reserved environment
    // null
    // origin
    // responseOrigin
    // policy container
    // policyContainer
    // final sandboxing flag set
    // finalSandboxFlags
    // cross-origin opener policy
    // coop
    // navigation timing type
    // "navigate"
    // about base URL
    // documentState's about base URL
  }

  // 9. Attempt to populate the history entry's document for historyEntry, given navigable, "navigate", sourceSnapshotParams, targetSnapshotParams, navigationId, navigationParams, cspNavigationType, with allowPOST set to true and completionSteps set to the following step:
  attemptPopulateHistoryEntryDocument(
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
      // 1. Append session history traversal steps to navigable's traversable to finalize a cross-document navigation given navigable, historyHandling, and historyEntry.
      appendSessionHistoryTraversalSteps(
        traversableNavigable(navigable),
        () =>
          finalizeCrossDocumentNavigation(
            navigable,
            historyHandling,
            historyEntry,
          ),
      );
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
  const type = contentType;

  // 2. If the user agent has been configured to process resources of the given type using some mechanism other than rendering the content in a navigable, then skip this step. Otherwise, if the type is one of the following types:
  switch (type) {
    case "text/html":
      return loadHTMLDocument(navigationParams);
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
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsing-the-web.html#attempt-to-populate-the-history-entry's-document)
 */
export function attemptPopulateHistoryEntryDocument(
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
): void {
  // 1. Assert: this is running in parallel.

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
      isFetchScheme(entry.URL.protocol) &&
      // - documentResource is null, or allowPOST is true and documentResource's request body is not failure,
      (documentResource === null || (allowPOST && documentResource.requestBody))
    ) {
      // then set navigationParams to the result of creating navigation params by fetching given entry, navigable, sourceSnapshotParams, targetSnapshotParams, cspNavigationType, navigationId, and navTimingType.
      navigationParams = createNavigationParamsByFetching(
        entry,
        navigable,
        sourceSnapshotParams,
        targetSnapshotParams,
        cspNavigationType,
        navigationId,
        navTimingType,
      );

      // 3. Otherwise, if entry's URL's scheme is not a fetch scheme,
    } else if (isFetchScheme(entry.URL.protocol)) {
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
  queueGlobalTask({}, navigableActiveWindow, () => {
    // 1. If navigable's ongoing navigation no longer equals navigationId,
    if (navigable.ongoingNavigation !== navigationId) {
      // then run completionSteps and return.
      completionSteps();
      return;
    }

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
export function createNavigationParamsByFetching(
  entry: SessionHistoryEntry,
  navigable: Navigable,
  sourceSnapshotParams: SourceSnapshotParams,
  targetSnapshotParams: TargetSnapshotParams,
  cspNavigationType: string,
  navigationId: string | null,
  navTimingType: NavigationTimingType,
): NavigationParams | NonFetchSchemeNavigationParams | null {
  // 1. Assert: this is running in parallel.

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
  // client: sourceSnapshotParams's fetch client
  // destination: "document"
  // use-URL-credentials flag: set
  // replaces client id: navigable's active document's relevant settings object's id

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
  let fetchController = null;

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
    // 1. If request's reserved client is not null and currentURL's origin is not the same as request's reserved client's creation URL's origin, then:

    // 1. Run the environment discarding steps for request's reserved client.

    // 2. Set request's reserved client to null.

    // 3. Set commitEarlyHints to null.

    // 2. If request's reserved client is null, then:

    // 1. Let topLevelCreationURL be currentURL.

    // 2. Let topLevelOrigin be null.

    // 3. If navigable is not a top-level traversable, then:

    // 1. Let parentEnvironment be navigable's parent's active document's relevant settings object.

    // 2. Set topLevelCreationURL to parentEnvironment's top-level creation URL.

    // 3. Set topLevelOrigin to parentEnvironment's top-level origin.

    // 4. Set request's reserved client to a new environment whose id is a unique opaque string, target browsing context is navigable's active browsing context, creation URL is currentURL, top-level creation URL is topLevelCreationURL, and top-level origin is topLevelOrigin.

    // 3. If the result of should navigation request of type be blocked by Content Security Policy? given request and cspNavigationType is "Blocked", then set response to a network error and break. [CSP]

    // 4. Set response to null.
    response = null;

    // 5. If fetchController is null, then set fetchController to the result of fetching request, with processEarlyHintsResponse set to processEarlyHintsResponse as defined below, processResponse set to processResponse as defined below, and useParallelQueue set to true.

    // Let processEarlyHintsResponse be the following algorithm given a response earlyResponse:

    // 1. If commitEarlyHints is null, then set commitEarlyHints to the result of processing early hint headers given earlyResponse and request's reserved client.

    // Let processResponse be the following algorithm given a response fetchedResponse:

    // 1. Set response to fetchedResponse.

    // 6. Otherwise, process the next manual redirect for fetchController.

    // 7. Wait until either response is non-null, or navigable's ongoing navigation changes to no longer equal navigationId.

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
    if (isHTTPScheme(locationURL.protocol)) {
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

  // id
  // navigationId
  // navigable
  // navigable
  // URL
  // locationURL
  // target snapshot sandboxing flags
  // targetSnapshotParams's sandboxing flags
  // source snapshot has transient activation
  // sourceSnapshotParams's has transient activation
  // initiator origin
  // responseOrigin
  // navigation timing type
  // navTimingType

  // 21. If any of the following are true:
  // - response is a network error;
  // - locationURL is failure; or
  // - locationURL is a URL whose scheme is a fetch scheme,

  // then return null.

  // 22. Assert: locationURL is null and response is not a network error.

  // 23. Let resultPolicyContainer be the result of determining navigation params policy container given response's URL, entry's document state's history policy container, sourceSnapshotParams's source policy container, null, and responsePolicyContainer.
  const resultPolicyContainer = determineNavigationParamsPolicyContainer(
    new URL(response!.url),
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
