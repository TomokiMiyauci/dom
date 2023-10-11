import { List } from "../../../infra/data_structures/list.ts";
import { Origin, PolicyContainer } from "../supporting_concepts.ts";
import {
  TraversableNavigable,
} from "../infrastructure_for_sequences_of_documents/navigable.ts";
import { StructuredSerializeForStorage } from "../../infra/safe_passing_of_structured_data.ts";
import { OrderedSet } from "../../../infra/data_structures/set.ts";

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
