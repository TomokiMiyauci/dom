import { fireEvent } from "../../../../dom/events/fire.ts";
import { isShadowRootNode } from "../../../../dom/nodes/shadow_root_utils.ts";
import { $, tree } from "../../../../internal.ts";
import { unblockRendering } from "../../semantics/document_utils.ts";
import {
  createClassicScript,
  fetchClassicScript,
  ImportMapParseResult,
  runClassicScript,
  Script,
} from "../../web_application_apis/scripting.ts";
import { matchJavaScriptMIMETypeEssence } from "../../../mimesniff/mod.ts";
import { documentBaseURL, encodingParseURL } from "../../infra/url.ts";
import { toASCIILowerCase } from "../../../infra/string.ts";

export function isHTMLScriptElement(
  element: Element,
): element is HTMLScriptElement {
  return element.localName === "script";
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#mark-as-ready)
 */
export function markAsReady(
  el: HTMLScriptElement,
  result: Script | ImportMapParseResult | null,
) {
  // 1. Set el's result to result.
  $(el).result = result;

  // 2. If el's steps to run when the result is ready are not null, then run them.

  // 3. Set el's steps to run when the result is ready to null.

  // 4. Set el's delaying the load event to false.
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element)
 */
export function executeScriptElement(el: HTMLScriptElement): void {
  // 1. Let document be el's node document.
  const document = $(el).nodeDocument;

  // 2. If el's preparation-time document is not equal to document, then return.
  if ($(el).preparationTimeDocument !== document) return;

  // 3. Unblock rendering on el.
  unblockRendering(el);

  // 4. If el's result is null,
  if (!$(el).result) {
    //  then fire an event named error at el,
    fireEvent("error", el);
    // and return.
    return;
  }

  let incremented = false;

  // 5. If el's from an external file is true, or el's type is "module", then increment document's ignore-destructive-writes counter.
  if ($(el).fromExternalFile || $(el).type === "module") {
    incremented = true;
    $(document).ignoreDestructiveWritesCounter++;
  }

  // 6. Switch on el's type:
  switch ($(el).type) {
    case "classic": {
      // 1. Let oldCurrentScript be the value to which document's currentScript object was most recently set.
      const oldCurrentScript = $(document).currentScript;

      // 2. If el's root is not a shadow root, then set document's currentScript attribute to el.
      if (!isShadowRootNode(tree.root(el))) {
        $(document).currentScript = el;
      } // Otherwise, set it to null.
      else $(document).currentScript = null;

      const { result } = $(el);
      // 3. Run the classic script given by el's result.
      if (typeof result === "object" && result && "record" in result) {
        runClassicScript(result as any);
      }

      // 4. Set document's currentScript attribute to oldCurrentScript.
      $(document).currentScript = oldCurrentScript;
      break;
    }
    case "module": {
      // 1. Assert: document's currentScript attribute is null.

      // 2. Run the module script given by el's result.
      break;
    }

    case "importmap": {
      // 1. Register an import map given el's relevant global object and el's result.
    }
  }

  // 7. Decrement the ignore-destructive-writes counter of document, if it was incremented in the earlier step.
  if (incremented) $(document).ignoreDestructiveWritesCounter--;

  // 8. If el's from an external file is true, then fire an event named load at el.
  if ($(el).fromExternalFile) fireEvent("load", el);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element)
 */
export async function prepareScriptElement(
  el: HTMLScriptElement,
): Promise<void> {
  // 1. If el's already started is true, then return.
  if ($(el).alreadyStarted) return;

  // 2. Let parser document be el's parser document.
  const parserDocument = $(el).parserDocument;

  // 3. Set el's parser document to null.
  $(el).parserDocument = null;

  // 4. If parser document is non-null and el does not have an async attribute, then set el's force async to true.

  // 5. Let source text be el's child text content.
  const sourceText = tree.childTextContent(el);

  // 6. If el has no src attribute, and source text is the empty string, then return.
  if (!el.hasAttribute("src") && !sourceText) return;

  // 7. If el is not connected, then return.

  let scriptBlockType = "";

  // 8. If any of the following are true:
  // - el has a type attribute whose value is the empty string;
  if (
    el.getAttribute("type") === "" ||
    // - el has no type attribute but it has a language attribute and that attribute's value is the empty string; or
    (!el.hasAttribute("type") && el.getAttribute("language") === "") ||
    // - el has neither a type attribute nor a language attribute,
    (!el.hasAttribute("type") && !el.hasAttribute("language"))
  ) {
    // then let the script block's type string for this script element be "text/javascript".
    scriptBlockType = "text/javascript";
  } // Otherwise, if el has a type attribute,
  else if (el.hasAttribute("type")) {
    scriptBlockType = toASCIILowerCase(el.getAttribute("type")!);
    // then let the script block's type string be the value of that attribute with leading and trailing ASCII whitespace stripped.
  }

  // Otherwise, el has a non-empty language attribute; let the script block's type string be the concatenation of "text/" and the value of el's language attribute.

  // 9. If the script block's type string is a JavaScript MIME type essence match, then set el's type to "classic".
  if (matchJavaScriptMIMETypeEssence(scriptBlockType)) $(el).type = "classic";

  // 10. Otherwise, if the script block's type string is an ASCII case-insensitive match for the string "module", then set el's type to "module".

  // 11. Otherwise, if the script block's type string is an ASCII case-insensitive match for the string "importmap", then set el's type to "importmap".

  // 12. Otherwise, return. (No script is executed, and el's type is left as null.)

  // 13. If parser document is non-null, then set el's parser document back to parser document and set el's force async to false.

  // 14. Set el's already started to true.
  $(el).alreadyStarted = true;

  // 15. Set el's preparation-time document to its node document.
  $(el).preparationTimeDocument = $(el).nodeDocument;

  // 16. If parser document is non-null, and parser document is not equal to el's preparation-time document, then return.

  // 17. If scripting is disabled for el, then return.

  // 18. If el has a nomodule content attribute and its type is "classic", then return.

  // 19. If el does not have a src content attribute, and the Should element's inline behavior be blocked by Content Security Policy? algorithm returns "Blocked" when given el, "script", and source text, then return. [CSP]

  // 20. If el has an event attribute and a for attribute, and el's type is "classic", then:

  // 1. Let for be the value of el's' for attribute.

  // 2. Let event be the value of el's event attribute.

  // 3. Strip leading and trailing ASCII whitespace from event and for.

  // 4. If for is not an ASCII case-insensitive match for the string "window", then return.

  // 5. If event is not an ASCII case-insensitive match for either the string "onload" or the string "onload()", then return.

  // 21. If el has a charset attribute, then let encoding be the result of getting an encoding from the value of the charset attribute.

  // If el does not have a charset attribute, or if getting an encoding failed, then let encoding be el's node document's the encoding.

  // 22. Let classic script CORS setting be the current state of el's crossorigin content attribute.

  // 23. Let module script credentials mode be the CORS settings attribute credentials mode for el's crossorigin content attribute.

  // 24. Let cryptographic nonce be el's [[CryptographicNonce]] internal slot's value.

  // 25. If el has an integrity attribute, then let integrity metadata be that attribute's value.

  // Otherwise, let integrity metadata be the empty string.

  // 26. Let referrer policy be the current state of el's referrerpolicy content attribute.

  // 27. Let fetch priority be the current state of el's fetchpriority content attribute.

  // 28. Let parser metadata be "parser-inserted" if el is parser-inserted, and "not-parser-inserted" otherwise.

  // 29 .Let options be a script fetch options whose cryptographic nonce is cryptographic nonce, integrity metadata is integrity metadata, parser metadata is parser metadata, credentials mode is module script credentials mode, referrer policy is referrer policy, and fetch priority is fetch priority.

  // 30. Let settings object be el's node document's relevant settings object.

  // 31. If el has a src content attribute, then:
  if (el.hasAttribute("src")) {
    // 1. If el's type is "importmap", then queue an element task on the DOM manipulation task source given el to fire an event named error at el, and return.

    // 2. Let src be the value of el's src attribute.
    const src = el.getAttribute("src");

    // 3. If src is the empty string,
    // For-testing
    if (!src || src.endsWith("testharnessreport.js")) {
      // then queue an element task on the DOM manipulation task source given el to fire an event named error at el,

      // and return.
      return;
    }

    // 4. Set el's from an external file to true.
    $(el).fromExternalFile = true;

    // 5. Let url be the result of encoding-parsing a URL given src, relative to el's node document.
    const url = encodingParseURL(src, $(el).nodeDocument);

    // 6. If url is failure,
    if (!url) {
      // then queue an element task on the DOM manipulation task source given el to fire an event named error at el,

      // and return.
      return;
    }

    // 7. If el is potentially render-blocking, then block rendering on el.

    // 8. Set el's delaying the load event to true.

    // 9. If el is currently render-blocking, then set options's render-blocking to true.

    // 10. Let onComplete given result be the following steps: // 1. Mark as ready el given result.
    const onComplete = (result: Script | null) => markAsReady(el, result);

    // 11. Switch on el's type:
    switch ($(el).type) {
      // "classic"
      case "classic": {
        // Fetch a classic script given url, settings object, options, classic script CORS setting, encoding, and onComplete.
        await fetchClassicScript(url, {} as any, {}, {}, {}, onComplete);
        break;
      }
    }

    // "module"
    // Fetch an external module script graph given url, settings object, options, and onComplete.

    // For performance reasons, user agents may start fetching the classic script or module graph (as defined above) as soon as the src attribute is set, instead, in the hope that el will be inserted into the document (and that the crossorigin attribute won't change value in the meantime). Either way, once el is inserted into the document, the load must have started as described in this step. If the UA performs such prefetching, but el is never inserted in the document, or the src attribute is dynamically changed, or the crossorigin attribute is dynamically changed, then the user agent will not execute the script so obtained, and the fetching process will have been effectively wasted.

    // 32. If el does not have a src content attribute:
  } else {
    // 1. Let base URL be el's node document's document base URL.
    const baseURL = documentBaseURL($(el).nodeDocument);

    // 2. Switch on el's type:
    switch ($(el).type) {
      // "classic"
      case "classic": {
        // 1. Let script be the result of creating a classic script using source text, settings object, base URL, and options.
        const script = createClassicScript(sourceText, {} as any, baseURL, {});

        // 2. Mark as ready el given script.
        markAsReady(el, script);
        break;
      }
      // "module"
      case "module": {
        // 1. Set el's delaying the load event to true.

        // 2. Fetch an inline module script graph, given source text, base URL, settings object, options, and with the following steps given result:
        break;
      }

      // "importmap"
      case "importmap": {
        break;
        // 1. If el's relevant global object's import maps allowed is false, then queue an element task on the DOM manipulation task source given el to fire an event named error at el, and return.

        // 2. Set el's relevant global object's import maps allowed to false.

        // 3. Let result be the result of creating an import map parse result given source text and base URL.

        // 4. Mark as ready el given result.
      }
    }
  }

  // ...
}
