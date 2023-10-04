import { $, internalSlots } from "../html/internal.ts";
import {
  asBody,
  Body,
  FetchController,
  FetchParams,
  FetchTimingInfo,
  isHTTPScheme,
  isRedirectStatus,
  locationURL as getLocationURL,
  readFully,
} from "./infrastructure.ts";
import { clone } from "./request.ts";
import { isNetworkError, networkError, ResponseInternals } from "./response.ts";

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-fetch)
 */
export async function fetch(
  request: Request,
  processRequestBodyChunkLength: Function | null = null,
  processRequestRndOfBody?: Function,
  processEarlyHintsResponse?: Function,
  processResponse?: Function,
  processResponseEndOfBody?: Function,
  processResponseConsumeBody?: (
    response: Response,
    body: false | null | Uint8Array,
  ) => void,
  useParallelQueue = false,
): Promise<FetchController> {
  // 1. Assert: request’s mode is "navigate" or processEarlyHintsResponse is null.

  // 2. Let taskDestination be null.
  let taskDestination = null;

  // 3. Let crossOriginIsolatedCapability be false.
  let crossOriginIsolatedCapability = false;

  // 4. If request’s client is non-null, then:
  if ($(request).client) {
    // 1. Set taskDestination to request’s client’s global object.

    // 2. Set crossOriginIsolatedCapability to request’s client’s cross-origin isolated capability.
  }

  // 5. If useParallelQueue is true,
  if (useParallelQueue) {
    // then set taskDestination to the result of starting a new parallel queue.
  }

  // 6. Let timingInfo be a new fetch timing info whose start time and post-redirect start time are the coarsened shared current time given crossOriginIsolatedCapability, and render-blocking is set to request’s render-blocking.
  const timingInfo = new FetchTimingInfo();

  // 7. Let fetchParams be a new fetch params whose request is request,
  const fetchParams = new FetchParams(request);
  //  timing info is timingInfo,
  fetchParams.timingInfo = timingInfo;
  // process request body chunk length is processRequestBodyChunkLength,
  fetchParams.processRequestBodyChunkLength = processRequestBodyChunkLength;
  // process request end-of-body is processRequestEndOfBody, process early hints response is processEarlyHintsResponse, process response is processResponse, process response consume body is processResponseConsumeBody, process response end-of-body is processResponseEndOfBody, task destination is taskDestination, and cross-origin isolated capability is crossOriginIsolatedCapability.
  if (processResponseConsumeBody) {
    fetchParams.processResponseConsumeBody = processResponseConsumeBody;
  }
  if (processResponse) fetchParams.processResponse = processResponse;

  const { body } = $(request);
  // 8. If request’s body is a byte sequence, then set request’s body to request’s body as a body.
  if (body instanceof Uint8Array) $(request).body = asBody(body);

  // 9. If request’s window is "client", then set request’s window to request’s client, if request’s client’s global object is a Window object; otherwise "no-window".

  // 10. If request’s origin is "client", then set request’s origin to request’s client’s origin.

  // 11. If all of the following conditions are true:
  // - request’s URL’s scheme is an HTTP(S) scheme
  // - request’s mode is "same-origin", "cors", or "no-cors"
  // - request’s window is non-null
  // - request’s method is `GET`
  // - request’s unsafe-request flag is not set or request’s header list is empty

  // then:

  // 1. Assert: request’s origin is same origin with request’s client’s origin.

  // 2. Let onPreloadedResponseAvailable be an algorithm that runs the following step given a response response: set fetchParams’s preloaded response candidate to response.

  // 3. Let foundPreloadedResource be the result of invoking consume a preloaded resource for request’s window, given request’s URL, request’s destination, request’s mode, request’s credentials mode, request’s integrity metadata, and onPreloadedResponseAvailable.

  // 4. If foundPreloadedResource is true and fetchParams’s preloaded response candidate is null, then set fetchParams’s preloaded response candidate to "pending".

  // 12. If request’s policy container is "client", then:
  if ($(request).policyContainer === "client") {
    // 1. If request’s client is non-null, then set request’s policy container to a clone of request’s client’s policy container. [HTML]

    // 2. Otherwise, set request’s policy container to a new policy container.
  }

  // 13. If request’s header list does not contain `Accept`, then:

  // 1. Let value be `*/*`.

  // 2. If request’s initiator is "prefetch", then set value to the document `Accept` header value.

  // 3. Otherwise, the user agent should set value to the first matching statement, if any, switching on request’s destination:

  // "document"
  // "frame"
  // "iframe"
  // the document `Accept` header value
  // "image"
  // `image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5`
  // "style"
  // `text/css,*/*;q=0.1`
  // 4. Append (`Accept`, value) to request’s header list.

  // 14. If request’s header list does not contain `Accept-Language`, then user agents should append (`Accept-Language, an appropriate header value) to request’s header list.

  // 15. If request’s internal priority is null, then use request’s priority, initiator, destination, and render-blocking in an implementation-defined manner to set request’s internal priority to an implementation-defined object.

  // 16. If request is a subresource request, then:

  // 1. Let record be a new fetch record whose request is request and controller is fetchParams’s controller.

  // 2. Append record to request’s client’s fetch group list of fetch records.

  // 17. Run main fetch given fetchParams.
  await mainFetch(fetchParams);

  // 18. Return fetchParams’s controller.
  return fetchParams.controller;
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-main-fetch)
 */
export async function mainFetch(
  fetchParams: FetchParams,
  recursive = false,
): Promise<any> {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request;

  // 2. Let response be null.
  let response: Response | null = null;

  // 3. If request’s local-URLs-only flag is set and request’s current URL is not local, then set response to a network error.

  // 4. Run report Content Security Policy violations for request.

  // 5. Upgrade request to a potentially trustworthy URL, if appropriate.

  // 6. Upgrade a mixed content request to a potentially trustworthy URL, if appropriate.

  // 7. If should request be blocked due to a bad port, should fetching request be blocked as mixed content, or should request be blocked by Content Security Policy returns blocked, then set response to a network error.

  // 8. If request’s referrer policy is the empty string, then set request’s referrer policy to request’s policy container’s referrer policy.

  // 9. If request’s referrer is not "no-referrer", then set request’s referrer to the result of invoking determine request’s referrer. [REFERRER]

  // 10. Set request’s current URL’s scheme to "https" if all of the following conditions are true:
  // - request’s current URL’s scheme is "http"
  // - request’s current URL’s host is a domain
  // - Matching request’s current URL’s host per Known HSTS Host Domain Name Matching results in either a superdomain match with an asserted includeSubDomains directive or a congruent match (with or without an asserted includeSubDomains directive) [HSTS]; or DNS resolution for the request finds a matching HTTPS RR per section 9.5 of [SVCB]. [HSTS] [SVCB]

  // 11. If recursive is false, then run the remaining steps in parallel.

  const resolve = (): Promise<Response> | Response => {
    // fetchParams’s preloaded response candidate is non-null
    if (fetchParams.preloadedResponseCandidate) {
      // 1. Wait until fetchParams’s preloaded response candidate is not "pending".

      // 2. Assert: fetchParams’s preloaded response candidate is a response.

      // 3. Return fetchParams’s preloaded response candidate.
      return fetchParams.preloadedResponseCandidate as Response;
    }

    // request’s current URL’s origin is same origin with request’s origin, and request’s response tainting is "basic"
    // TODO
    if ($(request).responseTainting === "basic") { // TODO
      // request’s current URL’s scheme is "data"
      // request’s mode is "navigate" or "websocket"
      // 1. Set request’s response tainting to "basic".
      $(request).responseTainting = "basic";

      // 2. Return the result of running scheme fetch given fetchParams.
      return fetchScheme(fetchParams);
    }

    // request’s mode is "same-origin"
    // Return a network error.
    if ($(request).mode === "same-origin") return networkError();

    // request’s mode is "no-cors"
    if ($(request).mode === "no-cors") {
      // 1. If request’s redirect mode is not "follow", then return a network error.
      if ($(request).redirectMode !== "follow") return networkError();

      // 2. Set request’s response tainting to "opaque".
      $(request).responseTainting = "opaque";

      // 3. Return the result of running scheme fetch given fetchParams.
      return fetchScheme(fetchParams);
    }

    // request’s current URL’s scheme is not an HTTP(S) scheme
    // Return a network error.

    // request’s use-CORS-preflight flag is set
    // request’s unsafe-request flag is set and either request’s method is not a CORS-safelisted method or CORS-unsafe request-header names with request’s header list is not empty
    // 1. Set request’s response tainting to "cors".

    // 2. Let corsWithPreflightResponse be the result of running HTTP fetch given fetchParams and true.

    // 3. If corsWithPreflightResponse is a network error, then clear cache entries using request.

    // 4. Return corsWithPreflightResponse.

    // Otherwise
    // 1. Set request’s response tainting to "cors".
    $(request).responseTainting = "cors";

    // 2. Return the result of running HTTP fetch given fetchParams.
    return fetchHTTP(fetchParams);
  };

  // 12. If response is null, then set response to the result of running the steps corresponding to the first matching statement:
  if (!response) response = await resolve();

  // 13. If recursive is true, then return response.
  if (recursive) return response;

  // 14. If response is not a network error and response is not a filtered response, then:

  // 1. If request’s response tainting is "cors", then:

  // 1. Let headerNames be the result of extracting header list values given `Access-Control-Expose-Headers` and response’s header list.

  // 2. If request’s credentials mode is not "include" and headerNames contains `*`, then set response’s CORS-exposed header-name list to all unique header names in response’s header list.

  // 3. Otherwise, if headerNames is non-null or failure, then set response’s CORS-exposed header-name list to headerNames.

  // 2. Set response to the following filtered response with response as its internal response, depending on request’s response tainting:

  // "basic"
  // basic filtered response
  // "cors"
  // CORS filtered response
  // "opaque"
  // opaque filtered response

  // 15. Let internalResponse be response, if response is a network error; otherwise response’s internal response.

  // 16. If internalResponse’s URL list is empty, then set it to a clone of request’s URL list.

  // 17. If request has a redirect-tainted origin, then set internalResponse’s has-cross-origin-redirects to true.

  // 18. If request’s timing allow failed flag is unset, then set internalResponse’s timing allow passed flag.

  // 19. If response is not a network error and any of the following returns blocked

  // - should internalResponse to request be blocked as mixed content
  // - should internalResponse to request be blocked by Content Security Policy
  // - should internalResponse to request be blocked due to its MIME type
  // - should internalResponse to request be blocked due to nosniff

  // then set response and internalResponse to a network error.

  // 20. If response’s type is "opaque", internalResponse’s status is 206, internalResponse’s range-requested flag is set, and request’s header list does not contain `Range`, then set response and internalResponse to a network error.

  // 21. If response is not a network error and either request’s method is `HEAD` or `CONNECT`, or internalResponse’s status is a null body status, set internalResponse’s body to null and disregard any enqueuing toward it (if any).

  // 22. If request’s integrity metadata is not the empty string, then:
  if ($(request).integrityMetadata) {
    // 1. Let processBodyError be this step: run fetch response handover given fetchParams and a network error.

    // 2. If response’s body is null, then run processBodyError and abort these steps.

    // 3. Let processBody given bytes be these steps:

    // 1. If bytes do not match request’s integrity metadata, then run processBodyError and abort these steps. [SRI]

    // 2. Set response’s body to bytes as a body.

    // 3. Run fetch response handover given fetchParams and response.

    // 4. Fully read response’s body given processBody and processBodyError.

    // 23. Otherwise,
  } else {
    // run fetch response handover given fetchParams and response.
    fetchResponseHandover(fetchParams, response);
  }
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#fetch-finale)
 */
export function fetchResponseHandover(
  fetchParams: FetchParams,
  response: Response,
) {
  // 1. Let timingInfo be fetchParams’s timing info.
  const { timingInfo } = fetchParams;

  // 2. If response is not a network error and fetchParams’s request’s client is a secure context, then set timingInfo’s server-timing headers to the result of getting, decoding, and splitting `Server-Timing` from response’s internal response’s header list.

  // The user agent may decide to expose `Server-Timing` headers to non-secure contexts requests as well.

  // 3. Let processResponseEndOfBody be the following steps:
  const processResponseEndOfBody = () => {
    // 1. Let unsafeEndTime be the unsafe shared current time.

    // 2. If fetchParams’s request’s destination is "document", then set fetchParams’s controller’s full timing info to fetchParams’s timing info.

    // 3. Set fetchParams’s controller’s report timing steps to the following steps given a global object global:

    // 1. If fetchParams’s request’s URL’s scheme is not an HTTP(S) scheme, then return.

    // 2. Set timingInfo’s end time to the relative high resolution time given unsafeEndTime and global.

    // 3. Let cacheState be response’s cache state.

    // 4. Let bodyInfo be response’s body info.

    // 5. If response’s timing allow passed flag is not set, then set timingInfo to the result of creating an opaque timing info for timingInfo and set cacheState to the empty string.

    // 6. Let responseStatus be 0.

    // 7. If fetchParams’s request’s mode is not "navigate" or response’s has-cross-origin-redirects is false:

    // 1. Set responseStatus to response’s status.

    // 2. Let mimeType be the result of extracting a MIME type from response’s header list.

    // 3. If mimeType is not failure, then set bodyInfo’s content type to the result of minimizing a supported MIME type given mimeType.

    // 8. If fetchParams’s request’s initiator type is non-null, then mark resource timing given timingInfo, fetchParams’s request’s URL, fetchParams’s request’s initiator type, global, cacheState, bodyInfo, and responseStatus.

    // 4. Let processResponseEndOfBodyTask be the following steps:
    const processResponseEndOfBodyTask = () => {
      // 1. Set fetchParams’s request’s done flag.
      // $(fetchParams.request)

      // 2. If fetchParams’s process response end-of-body is non-null, then run fetchParams’s process response end-of-body given response.
      if (fetchParams.processResponseEndOfBody) {
        fetchParams.processResponseEndOfBody(response);
      }

      // 3. If fetchParams’s request’s initiator type is non-null and fetchParams’s request’s client’s global object is fetchParams’s task destination, then run fetchParams’s controller’s report timing steps given fetchParams’s request’s client’s global object.
    };

    // 5. Queue a fetch task to run processResponseEndOfBodyTask with fetchParams’s task destination.
    queueMicrotask(processResponseEndOfBodyTask);
  };

  const { processResponse } = fetchParams;

  // 4. If fetchParams’s process response is non-null, then queue a fetch task to run fetchParams’s process response given response, with fetchParams’s task destination.
  if (processResponse) queueMicrotask(() => processResponse(response));

  // 5. Let internalResponse be response, if response is a network error; otherwise response’s internal response.
  const internalResponse = isNetworkError(response) ? response : response; // TODO

  // 6. If internalResponse’s body is null, then run processResponseEndOfBody.
  if (!$(internalResponse).body) processResponseEndOfBody();
  // 7. Otherwise:
  else {
    // 1. Let transformStream be a new TransformStream.

    // 2. Let identityTransformAlgorithm be an algorithm which, given chunk, enqueues chunk in transformStream.

    // 3. Set up transformStream with transformAlgorithm set to identityTransformAlgorithm and flushAlgorithm set to processResponseEndOfBody.

    // 4. Set internalResponse’s body’s stream to the result of internalResponse’s body’s stream piped through transformStream.
  }

  const { processResponseConsumeBody } = fetchParams;
  // 8. If fetchParams’s process response consume body is non-null, then:
  if (processResponseConsumeBody) {
    // 1. Let processBody given nullOrBytes be this step: run fetchParams’s process response consume body given response and nullOrBytes.
    const processBody = (nullOrBytes: null | Uint8Array) =>
      processResponseConsumeBody(response, nullOrBytes);
    // 2. Let processBodyError be this step: run fetchParams’s process response consume body given response and failure.
    const processBodyError = () => processResponseConsumeBody(response, false);

    const { body } = $(internalResponse);
    // 3. If internalResponse’s body is null, then queue a fetch task to run processBody given null, with fetchParams’s task destination.
    if (!body) queueMicrotask(() => processBody(null));
    // 4. Otherwise, fully read internalResponse’s body given processBody, processBodyError, and fetchParams’s task destination.
    else readFully(body, processBody, processBodyError);
  }
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-scheme-fetch)
 */
export function fetchScheme(
  fetchParams: FetchParams,
): Promise<Response> | Response {
  // 1. If fetchParams is canceled, then return the appropriate network error for fetchParams.

  // 2. Let request be fetchParams’s request.
  const { request } = fetchParams;
  const scheme = $(request).URL.protocol.slice(
    0,
    $(request).URL.protocol.length - 1,
  );

  switch (scheme) {
    default: {
      if (isHTTPScheme(scheme)) return fetchHTTP(fetchParams);

      return networkError();
    }
  }
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-http-fetch)
 */
export async function fetchHTTP(
  fetchParams: FetchParams,
  makeCORSPreflight = false,
): Promise<Response> {
  // 1. Let request be fetchParams’s request.
  const { request } = fetchParams;

  // 2. Let response and internalResponse be null.
  let response: Response | null = null!,
    internalResponse: Response | null = null;

  // 3. If request’s service-workers mode is "all", then:
  if ($(request).serviceWorkersMode === "all") {
    // 1. Let requestForServiceWorker be a clone of request.
    const requestForServiceWorker = clone(request);

    // 2. If requestForServiceWorker’s body is non-null, then:
    if ($(requestForServiceWorker).body) {
      // 1. Let transformStream be a new TransformStream.

      // 2. Let transformAlgorithm given chunk be these steps:

      // 1. If fetchParams is canceled, then abort these steps.

      // 2. If chunk is not a Uint8Array object, then terminate fetchParams’s controller.

      // 3. Otherwise, enqueue chunk in transformStream. The user agent may split the chunk into implementation-defined practical sizes and enqueue each of them. The user agent also may concatenate the chunks into an implementation-defined practical size and enqueue it.

      // 3. Set up transformStream with transformAlgorithm set to transformAlgorithm.

      // 4. Set requestForServiceWorker’s body’s stream to the result of requestForServiceWorker’s body’s stream piped through transformStream.
    }

    // 3. Let serviceWorkerStartTime be the coarsened shared current time given fetchParams’s cross-origin isolated capability.

    // 4. Set response to the result of invoking handle fetch for requestForServiceWorker, with fetchParams’s controller and fetchParams’s cross-origin isolated capability. [HTML] [SW]
    response = await handleFetch(
      requestForServiceWorker,
      fetchParams.controller,
      fetchParams.crossOriginIsolatedCapability,
    );

    // 5. If response is non-null, then:
    if (response) {
      // 1. Set fetchParams’s timing info’s final service worker start time to serviceWorkerStartTime.

      // 2. If request’s body is non-null, then cancel request’s body with undefined.

      // 3. Set internalResponse to response, if response is not a filtered response; otherwise to response’s internal response.
      // TODO
      internalResponse = response;

      // 4. If one of the following is true
      if ($(response).type === "error") {
        // - response’s type is "error"
        // - request’s mode is "same-origin" and response’s type is "cors"
        // - request’s mode is not "no-cors" and response’s type is "opaque"
        // - request’s redirect mode is not "manual" and response’s type is "opaqueredirect"
        // - request’s redirect mode is not "follow" and response’s URL list has more than one item.
        // then return a network error.
        return networkError();
      }
    }
  }

  // 4. If response is null, then:
  if (!response) {
    // 1. If makeCORSPreflight is true and one of these conditions is true:

    // - There is no method cache entry match for request’s method using request, and either request’s method is not a CORS-safelisted method or request’s use-CORS-preflight flag is set.
    // - There is at least one item in the CORS-unsafe request-header names with request’s header list for which there is no header-name cache entry match using request.
    // Then:

    // 1. Let preflightResponse be the result of running CORS-preflight fetch given request.

    // 2. If preflightResponse is a network error, then return preflightResponse.

    // 2. If request’s redirect mode is "follow", then set request’s service-workers mode to "none".

    // 3. Set response and internalResponse to the result of running HTTP-network-or-cache fetch given fetchParams.

    // 4. If request’s response tainting is "cors" and a CORS check for request and response returns failure, then return a network error.

    // 5. If the TAO check for request and response returns failure, then set request’s timing allow failed flag.
  }

  // 5. If either request’s response tainting or response’s type is "opaque", and the cross-origin resource policy check with request’s origin, request’s client, request’s destination, and internalResponse returns blocked, then return a network error.

  const { status } = $(internalResponse!);

  // 6. If internalResponse’s status is a redirect status:
  if (isRedirectStatus(status)) {
    // 1. If internalResponse’s status is not 303, request’s body is non-null, and the connection uses HTTP/2, then user agents may, and are even encouraged to, transmit an RST_STREAM frame.

    // 2. Switch on request’s redirect mode:
    switch ($(request).redirectMode) {
      // "error"
      case "error":
        // 1. Set response to a network error.
        response = networkError();
        break;

        // "manual"
      case "manual": {
        // 1. If request’s mode is "navigate", then set fetchParams’s controller’s next manual redirect steps to run HTTP-redirect fetch given fetchParams and response.

        // 2. Otherwise, set response to an opaque-redirect filtered response whose internal response is internalResponse.
        break;
      }

      // "follow"
      case "follow": {
        // 1. Set response to the result of running HTTP-redirect fetch given fetchParams and response.
        response = await fetchHTTPRedirect(fetchParams, response);
      }
    }
  }

  // 7. Return response.
  return response;
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-http-redirect-fetch)
 */
export function fetchHTTPRedirect(
  fetchParams: FetchParams,
  response: Response,
): Promise<Response> | Response {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request;

  // 2. Let internalResponse be response, if response is not a filtered response; otherwise response’s internal response.
  // TODO
  const internalResponse = response;

  // 3. Let locationURL be internalResponse’s location URL given request’s current URL’s fragment.
  const locationURL = getLocationURL(
    internalResponse,
    $(request).currentURL.hash,
  );

  // 4. If locationURL is null, then return response.
  if (locationURL === null) return response;

  // 5. If locationURL is failure, then return a network error.
  if (!locationURL) return networkError();

  // 6. If locationURL’s scheme is not an HTTP(S) scheme, then return a network error.

  // 7. If request’s redirect count is 20, then return a network error.
  if ($(request).redirectCount === 20) return networkError();

  // 8. Increase request’s redirect count by 1.
  $(request).redirectCount++;

  // 9. If request’s mode is "cors", locationURL includes credentials, and request’s origin is not same origin with locationURL’s origin, then return a network error.

  // 10. If request’s response tainting is "cors" and locationURL includes credentials, then return a network error.

  // 11. If internalResponse’s status is not 303, request’s body is non-null, and request’s body’s source is null, then return a network error.

  // 12. If one of the following is true

  // - internalResponse’s status is 301 or 302 and request’s method is `POST`
  // - internalResponse’s status is 303 and request’s method is not `GET` or `HEAD`

  // then:

  // 1. Set request’s method to `GET` and request’s body to null.

  // 2. For each headerName of request-body-header name, delete headerName from request’s header list.

  // 13. If request’s current URL’s origin is not same origin with locationURL’s origin, then for each headerName of CORS non-wildcard request-header name, delete headerName from request’s header list.

  // 14. If request’s body is non-null, then set request’s body to the body of the result of safely extracting request’s body’s source.

  // 15. Let timingInfo be fetchParams’s timing info.

  // 16. Set timingInfo’s redirect end time and post-redirect start time to the coarsened shared current time given fetchParams’s cross-origin isolated capability.

  // 17. If timingInfo’s redirect start time is 0, then set timingInfo’s redirect start time to timingInfo’s start time.

  // 18. Append locationURL to request’s URL list.
  $(request).URLList.append(locationURL);

  // 19. Invoke set request’s referrer policy on redirect on request and internalResponse. [REFERRER]

  // 20. Let recursive be true.
  let recursive = true;

  // 21. If request’s redirect mode is "manual", then:

  // 1. Assert: request’s mode is "navigate".

  // 2. Set recursive to false.

  // 23. Return the result of running main fetch given fetchParams and recursive.
  return mainFetch(fetchParams, recursive);
}

export async function handleFetch(
  request: Request,
  controller: FetchController,
  capability: boolean,
): Promise<Response> {
  const response = await globalThis.fetch($(request).currentURL, {
    headers: request.headers,
    method: request.method,
    redirect: request.redirect,
  });
  const internals = new ResponseInternals();

  internals.url = new URL(response.url);
  internals.status = response.status;
  const buffer = await response.arrayBuffer();
  const source = new Uint8Array(buffer);
  const body: Body = {
    source,
    length: null,
    stream: null as any as ReadableStream,
  };
  internals.body = body;
  internalSlots.extends(response, internals);

  return response;
}
