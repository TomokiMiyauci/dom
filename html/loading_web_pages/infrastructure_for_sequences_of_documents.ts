import {
  DocumentState,
  getSessionHistoryEntryDocument,
  SessionHistoryEntry,
} from "./navigation_and_session_history.ts";
import { newUniqueIntervalValue } from "../infra/common_microsyntaxes.ts";
import {
  determineCreationSandboxingFlags,
  Origin,
  sameOriginDomain,
} from "./supporting_concepts.ts";
import { $ } from "../internal.ts";
import * as DOM from "../../internal.ts";
import { html } from "../../deps.ts";
import { documentBaseURL } from "../infra/url.ts";
import { origin } from "../../url/url.ts";
import { populateHTMLHeadBody } from "./document_lifecycle.ts";
import { createPermissionPolicyForNavigable } from "../../permissions_policy/algorithm.ts";

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
  get activeDocument(): Document | null {
    return getSessionHistoryEntryDocument(this.activeSessionHistoryEntry);
  }

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
  const document = contentNavigable.activeDocument;

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

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#browsing-context)
 */
class BrowsingContext {}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#creating-a-new-browsing-context)
 */
export function createNewBrowsingContextAndDocument(
  creator: Document | null,
  embedder: Element | null,
  group: unknown,
): { browsingContext: BrowsingContext; document: Document } {
  // 1. Let browsingContext be a new browsing context.
  const browsingContext = new BrowsingContext();

  // 2. Let unsafeContextCreationTime be the unsafe shared current time.

  // 3. Let creatorOrigin be null.
  let creatorOrigin = null;

  // 4. Let creatorBaseURL be null.
  let creatorBaseURL: URL | null = null;

  // 5. If creator is non-null, then:
  if (creator) {
    // 1. Set creatorOrigin to creator's origin.
    creatorOrigin = DOM.$(creator).origin;

    // 2. Set creatorBaseURL to creator's document base URL.
    creatorBaseURL = documentBaseURL(creator);

    // 3. Set browsingContext's virtual browsing context group ID to creator's browsing context's top-level browsing context's virtual browsing context group ID.
  }

  // 6. Let sandboxFlags be the result of determining the creation sandboxing flags given browsingContext and embedder.
  const sandboxFlags = determineCreationSandboxingFlags(
    browsingContext,
    embedder,
  );

  // 7. Let origin be the result of determining the origin given about:blank, sandboxFlags, and creatorOrigin.
  const origin = determineOrigin(
    new URL("about:blank"),
    sandboxFlags,
    creatorOrigin,
  );

  // 8. Let permissionsPolicy be the result of creating a permissions policy given embedder and origin. [PERMISSIONSPOLICY]
  const permisionsPolicy = createPermissionPolicyForNavigable(embedder, origin);

  // 9. Let agent be the result of obtaining a similar-origin window agent given origin, group, and false.

  // 10. Let realm execution context be the result of creating a new realm given agent and the following customizations:

  // - For the global object, create a new Window object.

  // - For the global this binding, use browsingContext's WindowProxy object.

  // 11. Let topLevelCreationURL be about:blank if embedder is null; otherwise embedder's relevant settings object's top-level creation URL.

  // 12. Let topLevelOrigin be origin if embedder is null; otherwise embedder's relevant settings object's top-level origin.

  // 13. Set up a window environment settings object with about:blank, realm execution context, null, topLevelCreationURL, and topLevelOrigin.

  // 14. Let loadTimingInfo be a new document load timing info with its navigation start time set to the result of calling coarsen time with unsafeContextCreationTime and the new environment settings object's cross-origin isolated capability.

  // 15. Let document be a new Document, with:
  const document = new Document();
  /**
   * | name                       | value             |
   * | -------------------------- | ----------------- |
   * | type                       | "html"            |
   * | content type               | "text/html"       |
   * | mode                       | "quirks"          |
   * | origin                     | origin            |
   * | browsing context           | browsingContext   |
   * | permissions policy         | permissionsPolicy |
   * | active sandboxing flag set | sandboxFlags      |
   * | load timing info           | loadTimingInfo    |
   * | is initial about:blank     | true              |
   * | about base URL             | creatorBaseURL    |
   */
  DOM.$(document).type = "html";
  DOM.$(document).contentType = "text/html";
  DOM.$(document).mode = html.DOCUMENT_MODE.QUIRKS;
  DOM.$(document).origin = origin;
  $(document).aboutBaseURL = creatorBaseURL;

  // 16. If creator is non-null, then:
  if (creator) {
    // 1. Set document's referrer to the serialization of creator's URL.

    // 2. Set document's policy container to a clone of creator's policy container.

    // 3. If creator's origin is same origin with creator's relevant settings object's top-level origin, then set document's cross-origin opener policy to creator's browsing context's top-level browsing context's active document's cross-origin opener policy.
  }

  // 17. Assert: document's URL and document's relevant settings object's creation URL are about:blank.

  // 18. Mark document as ready for post-load tasks.

  // 19. Populate with html/head/body given document.
  populateHTMLHeadBody(document);

  // 20. Make active document.

  // 21. Completely finish loading document.

  // 22. Return browsingContext and document.
  return { browsingContext, document };
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#determining-the-origin)
 */
export function determineOrigin(
  url: URL,
  sandboxFlags: unknown,
  sourceOrigin: Origin | null,
): Origin {
  // 1. If sandboxFlags has its sandboxed origin browsing context flag set, then return a new opaque origin.

  // 2. If url is null, then return a new opaque origin.

  // 3. If url is about:srcdoc, then:

  // 1. Assert: sourceOrigin is non-null.

  // 2. Return sourceOrigin.

  // 4. If url matches about:blank and sourceOrigin is non-null, then return sourceOrigin.

  // 5. Return url's origin.
  return origin(url);
}
