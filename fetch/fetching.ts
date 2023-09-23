import {
  FetchController,
  FetchParams,
  FetchTimingInfo,
} from "./infrastructure.ts";

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-fetch)
 */
export function fetch(
  request: Request,
  processRequestBodyChunkLength: Function | null = null,
  processRequestRndOfBody?: Function,
  processEarlyHintsResponse?: Function,
  processResponse?: Function,
  processResponseEndOfBody?: Function,
  processResponseCensumeBody?: Function,
  useParallelQueue = false,
): FetchController {
  // 1. Assert: request’s mode is "navigate" or processEarlyHintsResponse is null.

  // 2. Let taskDestination be null.
  let taskDestination = null;

  // 3. Let crossOriginIsolatedCapability be false.
  let crossOriginIsolatedCapability = false;

  // 4. If request’s client is non-null, then:

  // 1. Set taskDestination to request’s client’s global object.

  // 2. Set crossOriginIsolatedCapability to request’s client’s cross-origin isolated capability.

  // 5. If useParallelQueue is true, then set taskDestination to the result of starting a new parallel queue.

  // 6. Let timingInfo be a new fetch timing info whose start time and post-redirect start time are the coarsened shared current time given crossOriginIsolatedCapability, and render-blocking is set to request’s render-blocking.
  const timingInfo = new FetchTimingInfo();

  // 7. Let fetchParams be a new fetch params whose request is request,
  const fetchParams = new FetchParams(request);
  //  timing info is timingInfo,
  fetchParams.timingInfo = timingInfo;
  // process request body chunk length is processRequestBodyChunkLength,
  fetchParams.processRequestBodyChunkLength = processRequestBodyChunkLength;
  // process request end-of-body is processRequestEndOfBody, process early hints response is processEarlyHintsResponse, process response is processResponse, process response consume body is processResponseConsumeBody, process response end-of-body is processResponseEndOfBody, task destination is taskDestination, and cross-origin isolated capability is crossOriginIsolatedCapability.

  // 8. If request’s body is a byte sequence, then set request’s body to request’s body as a body.

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

  // 1. If request’s client is non-null, then set request’s policy container to a clone of request’s client’s policy container. [HTML]

  // 2. Otherwise, set request’s policy container to a new policy container.

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
  mainFetch(fetchParams);

  // 18. Return fetchParams’s controller.
  return fetchParams.controller;
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-main-fetch)
 */
export function mainFetch(
  fetchParams: FetchParams,
  recursive = false,
) {
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

  // 12. If response is null, then set response to the result of running the steps corresponding to the first matching statement:

  // fetchParams’s preloaded response candidate is non-null
  // 1. Wait until fetchParams’s preloaded response candidate is not "pending".

  // 2. Assert: fetchParams’s preloaded response candidate is a response.

  // 3. Return fetchParams’s preloaded response candidate.

  // request’s current URL’s origin is same origin with request’s origin, and request’s response tainting is "basic"
  // request’s current URL’s scheme is "data"
  // request’s mode is "navigate" or "websocket"
  // 1. Set request’s response tainting to "basic".

  // 2. Return the result of running scheme fetch given fetchParams.

  // request’s mode is "same-origin"
  // Return a network error.

  // request’s mode is "no-cors"
  // 1. If request’s redirect mode is not "follow", then return a network error.

  // 2. Set request’s response tainting to "opaque".

  // 3. Return the result of running scheme fetch given fetchParams.

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

  // 2. Return the result of running HTTP fetch given fetchParams.

  // 13. If recursive is true, then return response.

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

  // 1. Let processBodyError be this step: run fetch response handover given fetchParams and a network error.

  // 2. If response’s body is null, then run processBodyError and abort these steps.

  // 3. Let processBody given bytes be these steps:

  // 1. If bytes do not match request’s integrity metadata, then run processBodyError and abort these steps. [SRI]

  // 2. Set response’s body to bytes as a body.

  // 3. Run fetch response handover given fetchParams and response.

  // 4. Fully read response’s body given processBody and processBodyError.

  // 23. Otherwise, run fetch response handover given fetchParams and response.
}
