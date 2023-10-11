import { List } from "../infra/data_structures/list.ts";
import { extractSafely } from "./body_init_utils.ts";
import { $ } from "../../internal.ts";

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params)
 */
export class FetchParams {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-request)
   */
  request: Request;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-request-body)
   */
  processRequestBodyChunkLength: Function | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-request-end-of-body)
   */
  processRequestEndOfBody: Function | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-early-hints-response)
   */
  processEarlyHintsResponse: Function | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-response)
   */
  processResponse: Function | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-response-end-of-body)
   */
  processResponseEndOfBody: ((response: Response) => void) | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-process-response-consume-body)
   */
  processResponseConsumeBody:
    | ((response: Response, body: false | null | Uint8Array) => void)
    | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-task-destination)
   */
  takeDestination: unknown | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-cross-origin-isolated-capability)
   */
  crossOriginIsolatedCapability = false;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-controller)
   */
  controller: FetchController = new FetchController();

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-timing-info)
   */
  timingInfo: FetchTimingInfo = new FetchTimingInfo();

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-params-preloaded-response-candidate)
   */
  preloadedResponseCandidate: "pending" | Response | null = null;

  constructor(request: Request) {
    this.request = request;
  }
}

export function processNextManualRedirect(
  controller: FetchController & { nextManualRedirectSteps: Function }, // 1. Assert: controller’s report timing steps is non-null.
): void {
  // 2. Call controller’s report timing steps with global.
  controller.nextManualRedirectSteps();
}

export class FetchController {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-controller-state)
   */
  state: "ongoing" | "terminated" | "aborted" = "ongoing";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-controller-full-timing-info)
   */
  fullTimingInfo: FetchTimingInfo | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-controller-report-timing-steps)
   */

  reportTimingSteps: Function | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-controller-serialized-abort-reason)
   */

  serializedAbortReason: unknown | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-controller-next-manual-redirect-steps)
   */

  nextManualRedirectSteps: Function | null = null;
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info)
 */
export class FetchTimingInfo {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-start-time)
   */
  startTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-redirect-start-time)
   */
  redirectStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-redirect-end-time)
   */
  redirectEndTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-post-redirect-start-time)
   */
  postRedirectStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-final-service-worker-start-time)
   */
  finalServiceWorkerStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-final-network-request-start-time)
   */
  finalNetworkRequestStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-first-interim-network-response-start-time)
   */
  firstInterimNetworkResponseStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-final-network-response-start-time)
   */
  finalNetworkResponseStartTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-end-time)
   */
  endTime = 0;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-final-connection-timing-info)
   */
  finalConnectionTimingInfo: ConnectionTimingInfo | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-server-timing-headers)
   */
  serverTimingHeaders: List<string> = new List();

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-timing-info-render-blocking)
   */
  renderBlocking = false;
}

const httpSchemes = new Set<string>(["http", "https"]);

type Failure = false;

export type HTTPScheme = "http" | "https";

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#http-scheme)
 */
export function isHTTPScheme(scheme: string): scheme is HTTPScheme {
  return httpSchemes.has(scheme);
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-response-location-url)
 */
export function locationURL(
  response: Response,
  requestFragment: string | null,
): URL | null | Failure {
  // 1. If response’s status is not a redirect status, then return null.
  if (!isRedirectStatus($(response).status)) return null;

  const locationValue = response.headers.get("Location");

  if (!locationValue) return null;
  const location = new URL(locationValue);
  // 2. Let location be the result of extracting header list values given `Location` and response’s header list.

  // 3. If location is a header value, then set location to the result of parsing location with response’s URL.

  // 4. If location is a URL whose fragment is null, then set location’s fragment to requestFragment.

  // 5. Return location.
  return location;
}

const fetchSchemes = new Set<string>(["about", "blob", "data", "file"]);

export function isFetchScheme(
  scheme: string,
): scheme is "about" | "blob" | "data" | "file" | HTTPScheme {
  return fetchSchemes.has(scheme) || isHTTPScheme(scheme);
}

export type RedirectStatus = 301 | 302 | 303 | 307 | 308;

namespace RedirectStatus {
  export const data = new Set([301, 302, 303, 307, 308]);
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#redirect-status)
 */
export function isRedirectStatus(status: number): status is RedirectStatus {
  return RedirectStatus.data.has(status);
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#extract-header-values)
 */
export function extractHeaderValues(header: Header) {
}

// export function extractHeaderListValues(
//   name: HeaderName,
//   list: HeaderList,
// ): List<string> | false | null {
//   // 1. If list does not contain name, then return null.

//   // 2. If the ABNF for name allows a single header and list contains more than one, then return failure.

//   // 3. Let values be an empty list.
//   const values = new List();

//   // 4. For each header header list contains whose name is name:

//   // 1. Let extract be the result of extracting header values from header.

//   // 2. If extract is failure, then return failure.

//   // 3. Append each value in extract, in order, to values.

//   // 5. Return values.
//   return values;
// }

type ByteSequence = string;

type HeaderName = ByteSequence;

type HeaderList = List<Header>;

export type Header = [name: ByteSequence, value: ByteSequence];

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#connection-timing-info)
 */
export class ConnectionTimingInfo {
  domainLookupStartTime = 0;

  domainLookupEndTime = 0;

  connectionStartTime = 0;

  connectionEndTime = 0;

  secureConnectionStartTime = 0;

  ALPNNegotiatedProtocol: unknown;
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-body)
 */
export class Body {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-body-source)
   */
  stream: ReadableStream;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-body-source)
   */
  source: Uint8Array | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-body-total-bytes)
   */
  length: number | null = null;

  constructor(stream: ReadableStream) {
    this.stream = stream;
  }
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#byte-sequence-as-a-body)
 */
export function asBody(bytes: Uint8Array): Body {
  return extractSafely(bytes)[0];
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#body-fully-read)
 */
export function readFully(
  body: Body,
  processBody: (nullOrBytes: null | Uint8Array) => void,
  processBodyError: Function,
) {
  processBody(body.source);
}
