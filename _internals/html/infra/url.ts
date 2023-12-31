import { $ } from "../../../internal.ts";
import { EnvironmentSettingsObject } from "../web_application_apis/scripting.ts";
import { URLSerializer } from "../../url/serializer.ts";
import * as $$ from "../../../symbol.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#fallback-base-url)
 */
export function fallbackBaseURL(document: Document): URL {
  // 1. If document is an iframe srcdoc document, then:
  if (isIframeSrcdocDocument(document)) {
    // 1. Assert: document's about base URL is non-null.

    // 2. Return document's about base URL.
    return $(document).aboutBaseURL!;
  }

  const { aboutBaseURL } = $(document);
  // 2. If document's URL matches about:blank and document's about base URL is non-null, then return document's about base URL.
  if (matchAboutBlank(document[$$.URL]) && aboutBaseURL) return aboutBaseURL;

  // 3. Return document's URL.
  return document[$$.URL];
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#an-iframe-srcdoc-document)
 */
export function isIframeSrcdocDocument(document: Document): boolean {
  // TODO
  return false;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url)
 */
export function documentBaseURL(document: Document): URL {
  const base = document.querySelector("base[href]");
  const fallbackURL = fallbackBaseURL(document);
  // 1. If there is no base element that has an href attribute in the Document, then return the Document's fallback base URL.
  if (!base) return fallbackURL;
  // 2. Otherwise, return the frozen base URL of the first base element in the Document that has an href attribute, in tree order.
  else return frozenBaseURL(base, fallbackURL);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url)
 */
function frozenBaseURL(baseElement: Element, fallbackBaseURL: URL): URL {
  const baseHrefAttribute = baseElement.getAttributeNS(null, "href");

  if (baseHrefAttribute === null) return fallbackBaseURL;

  return new URL(baseHrefAttribute, fallbackBaseURL);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#matches-about:blank)
 */
export function matchAboutBlank(url: URL): boolean {
  // TODO
  return url.protocol === "about:" && url.pathname === "blank" &&
    url.username === "" && url.password === "" && url.host === "";
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-a-url)
 */
export function encodingParseURL(
  url: string,
  environment: Document | EnvironmentSettingsObject,
): URL | false {
  // 4. Let baseURL be environment's base URL, if environment is a Document object; otherwise environment's API base URL.
  const baseURL = "URL" in environment
    ? documentBaseURL(environment)
    : environment.APIBaseURL;

  // 5. Return the result of applying the URL parser to url, with baseURL and encoding.

  return new URL(url, baseURL);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-and-serializing-a-url)
 */
export function encodingParseAndSerializeURL(
  url: string,
  environment: Document | EnvironmentSettingsObject,
): string | false {
  // 1. Let url be the result of encoding-parsing a URL given url, relative to environment.
  const parsedURL = encodingParseURL(url, environment);

  // 2. If url is failure, then return failure.
  if (!parsedURL) return false;

  // 3. Return the result of applying the URL serializer to url.
  return URLSerializer.serialize(parsedURL);
}
