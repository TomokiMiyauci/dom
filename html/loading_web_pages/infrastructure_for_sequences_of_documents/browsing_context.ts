import {
  determineCreationSandboxingFlags,
  OpaqueOrigin,
  Origin,
} from "../supporting_concepts.ts";
import { $ } from "../../../internal.ts";
import { html } from "../../../deps.ts";
import { documentBaseURL } from "../../infra/url.ts";
import { origin } from "../../../url/url.ts";
import { populateHTMLHeadBody } from "../document_lifecycle.ts";
import { createPermissionPolicyForNavigable } from "../../../permissions_policy/algorithm.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#browsing-context)
 */
export class BrowsingContext {
  WindowProxy: WindowProxy = window;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#opener-browsing-context)
   */
  openerBrowsingContext: BrowsingContext | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#opener-origin-at-creation)
   */
  openerOriginAtCreation: Origin | null = null;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#active-window)
 */
export function activeWindow(
  browsingContext: BrowsingContext,
): Window & typeof globalThis {
  // its WindowProxy object's [[Window]] internal slot value.
  return browsingContext.WindowProxy.window;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-sequences.html#active-document)
 */
export function activeDocument(browsingContext: BrowsingContext): Document {
  return activeWindow(browsingContext).document;
}

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
    creatorOrigin = $(creator).origin;

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
  $(document).type = "html";
  $(document).contentType = "text/html";
  $(document).mode = html.DOCUMENT_MODE.QUIRKS;
  $(document).origin = origin;
  $(document).browsingContext = browsingContext;
  $(document).isInitialAboutBlank = true;
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
  url: URL | null,
  sandboxFlags: unknown,
  sourceOrigin: Origin | null,
): Origin {
  // 1. If sandboxFlags has its sandboxed origin browsing context flag set, then return a new opaque origin.

  // 2. If url is null, then return a new opaque origin.
  if (!url) return new OpaqueOrigin();

  // 3. If url is about:srcdoc, then:

  // 1. Assert: sourceOrigin is non-null.

  // 2. Return sourceOrigin.

  // 4. If url matches about:blank and sourceOrigin is non-null, then return sourceOrigin.

  // 5. Return url's origin.
  return origin(url);
}
