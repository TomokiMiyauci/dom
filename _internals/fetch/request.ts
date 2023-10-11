import { PolicyContainer } from "../html/loading_web_pages/supporting_concepts.ts";
import {
  Environment,
  EnvironmentSettingsObject,
} from "../html/web_application_apis/scripting.ts";
import { $, internalSlots } from "../../internal.ts";
import { Body } from "./infrastructure.ts";
import { List } from "../infra/data_structures/list.ts";

export class RequestInternals {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-method)
   */
  method = "GET";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-url)
   */
  URL: URL;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-url-list)
   */
  URLList: List<URL>;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-current-url)
   */
  currentURL!: URL;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-reserved-client)
   */
  reservedClient: Environment | EnvironmentSettingsObject | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-replaces-client-id)
   */
  replacesClientId = "";

  body: Int8Array | Body | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-client)
   */
  client: EnvironmentSettingsObject | null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#request-keepalive-flag)
   */
  keepalive = false;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#request-initiator-type)
   */
  initiatorType:
    | "audio"
    | "beacon"
    | "body"
    | "css"
    | "early-hints"
    | "embed"
    | "fetch"
    | "font"
    | "frame"
    | "iframe"
    | "image"
    | "img"
    | "input"
    | "link"
    | "object"
    | "ping"
    | "script"
    | "track"
    | "video"
    | "xmlhttprequest"
    | "other"
    | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#request-service-workers-mode)
   */
  serviceWorkersMode: "all" | "none" = "all";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-initiator)
   */
  initiator:
    | ""
    | "download"
    | "imageset"
    | "manifest"
    | "prefetch"
    | "prerender"
    | "xslt" = "";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-policy-container)
   */
  policyContainer: "client" | PolicyContainer = "client";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-referrer)
   */
  referrer: "no-referrer" | "client" | URL = "client";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-referrer-policy)
   */
  referrerPolicy: ReferrerPolicy = "";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-mode)
   */
  mode: "same-origin" | "cors" | "no-cors" | "navigate" | "websocket" =
    "no-cors";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-use-url-credentials-flag)
   */
  useCORSPreflightFlag = false;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-integrity-metadata)
   */
  integrityMetadata = "";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-redirect-count)
   */
  redirectCount = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-redirect-mode)
   */
  redirectMode: RequestRedirect = "follow";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-request-response-tainting)
   */
  responseTainting: "basic" | "cors" | "opaque" = "basic";

  constructor({ URL, client }: Pick<RequestInternals, "URL" | "client">) {
    this.URL = URL;
    this.client = client;
    this.URLList = new List([this.URL]);

    Object.defineProperty(this, "currentURL", {
      get: () => this.URLList[this.URLList.size - 1],
    });
  }
}

export function clone(request: Request): Request {
  // 1. Let newRequest be a copy of request, except for its body.
  const newRequest = new Request(request.url, request);

  internalSlots.extends(newRequest, $(request));

  // 2. If request’s body is non-null, set newRequest’s body to the result of cloning request’s body.

  // 3. Return newRequest.
  return newRequest;
}
