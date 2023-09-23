import {
  DocumentState,
  getSessionHistoryEntryDocument,
  SessionHistoryEntry,
} from "../navigation_and_session_history.ts";
import { newUniqueIntervalValue } from "../../infra/common_microsyntaxes.ts";
import { sameOriginDomain } from "../supporting_concepts.ts";
import {
  BrowsingContext,
  createNewBrowsingContextAndDocument,
} from "./browsing_context.ts";
import { $ } from "../../internal.ts";
import * as DOM from "../../../internal.ts";

/** A navigable presents a Document to the user via its active session history entry.
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable)
 */
export class Navigable {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-id)
   */
  id: string = newUniqueIntervalValue(); // new unique internal value.

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-parent)
   */
  parent: Navigable | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-current-history-entry)
   */
  currentSessionHistoryEntry!: SessionHistoryEntry;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-active-history-entry)
   */
  activeSessionHistoryEntry!: SessionHistoryEntry;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#is-closing)
   */
  isClosing = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#delaying-load-events-mode)
   */
  isDelayingLoadEvents = false;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable-container)
 */
export type NavigableContainer = Element;

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-document)
 */
export function activeDocument(navigable: Navigable): Document | null {
  // its active session history entry's document.
  return getSessionHistoryEntryDocument(navigable.activeSessionHistoryEntry);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-bc)
 */
export function activeBrowsingContext(
  navigable: Navigable,
): BrowsingContext | null {
  // its active document's browsing context.
  const navigableActiveDocument = activeDocument(navigable);

  return navigableActiveDocument && $(navigableActiveDocument).browsingContext;
}

export function nodeNavigable(node: NavigableContainer) {
  const { nodeDocument } = DOM.$(node);
}

export function initializeNavigable(
  navigable: Navigable,
  documentState: DocumentState & { document: Document }, // 1. Assert: documentState's document is non-null.
  parent: Navigable | null = null,
): void {
  // 2. Let entry be a new session history entry, with
  // URL            documentState's document's URL
  // document state documentState
  const entry = new SessionHistoryEntry({
    URL: DOM.$(documentState.document).URL,
    documentState,
  });

  navigable.currentSessionHistoryEntry = entry;
  navigable.activeSessionHistoryEntry = entry;
  navigable.parent = parent;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-container-document)
 */
export function contentDocument(
  container: NavigableContainer,
): Document | null {
  const { contentNavigable } = $(container);
  // 1. If container's content navigable is null, then return null.
  if (!contentNavigable) return null;

  // 2. Let document be container's content navigable's active document.
  const document = activeDocument(contentNavigable);

  // 3. If document's origin and container's node document's origin are not same origin-domain, then return null.
  if (document) {
    const documentOrigin = DOM.$(document).origin;
    const containerNodeDocument = DOM.$(container).nodeDocument;
    const containerNodeDocumentOrigin = DOM.$(containerNodeDocument).origin;

    if (!sameOriginDomain(documentOrigin, containerNodeDocumentOrigin)) {
      return null;
    }
  }

  // 4. Return document.
  return document;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#create-a-new-child-navigable)
 */
export function createNewChildNavigable(element: Element): void {
  // 1. Let parentNavigable be element's node navigable.
  const parentNavigable: null = null;

  // 2. Let group be element's node document's browsing context's top-level browsing context's group.

  // 3. Let browsingContext and document be the result of creating a new browsing context and document given element's node document, element, and group.
  const { document } = createNewBrowsingContextAndDocument(
    DOM.$(element).nodeDocument,
    element,
    {},
  );

  // 4. Let targetName be null. // the initial value maybe be empty string
  let targetName = "";

  // 5. If element has a name content attribute, then set targetName to the value of that attribute.
  if (element.hasAttribute("name")) targetName = element.getAttribute("name")!;

  // 6. Let documentState be a new document state, with
  const documentState = new DocumentState();
  // document              document
  documentState.document = document;
  // initiator origin      document's origin
  documentState.initiatorOrigin = DOM.$(document).origin;
  // origin                document's origin
  documentState.origin = DOM.$(document).origin;
  // navigable target name targetName
  documentState.navigableTargetName = targetName;
  // about base URL        document's about base URL
  documentState.aboutBaseURL = $(document).aboutBaseURL;
  // 8. Let navigable be a new navigable.
  const navigable = new Navigable();

  // 9. Initialize the navigable navigable given documentState and parentNavigable.
  initializeNavigable(navigable, documentState as any, parentNavigable);

  // 10. Set element's content navigable to navigable.
  $(element).contentNavigable = navigable;

  // 11. Let historyEntry be navigable's active session history entry.

  // 12. Let traversable be parentNavigable's traversable navigable.

  // 1. Append the following session history traversal steps to traversable:

  // 2. Let parentDocState be parentNavigable's active session history entry's document state.

  // 3. Let parentNavigableEntries be the result of getting session history entries for parentNavigable.

  // 4. Let targetStepSHE be the first session history entry in parentNavigableEntries whose document state equals parentDocState.

  // 5. Set historyEntry's step to targetStepSHE's step.

  // 6. Let nestedHistory be a new nested history whose id is navigable's id and entries list is « historyEntry ».

  // 7. Append nestedHistory to parentDocState's nested histories.

  // 8. Update for navigable creation/destruction given traversable.
}

export function container(navigable: Navigable): NavigableContainer | null {
  return null;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-container-document)
 */
export function containerDocument(navigable: Navigable): Document | null {
  const navigableContainer = container(navigable);
  // 1. If navigable's container is null, then return null.
  if (!navigableContainer) return null;

  // 2. Return navigable's container's node document.
  return DOM.$(navigableContainer).nodeDocument;
}
