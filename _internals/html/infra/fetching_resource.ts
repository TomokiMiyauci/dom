import { internalSlots } from "../../../internal.ts";
import { RequestInternals } from "../../fetch/request.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#will-lazy-load-element-steps)
 */
export function willLoadElementSteps(element: Element): boolean {
  // 1. If scripting is disabled for element, then return false.

  // 2. If element's lazy loading attribute is in the Lazy state, then return true.

  // 3. Return false.
  return false;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#create-a-potential-cors-request)
 */
export function createPotentialCORSRequest(
  url: URL,
  destination: unknown,
  corsAttributeState: unknown,
): Request {
  // 1. Let mode be "no-cors" if corsAttributeState is No CORS, and "cors" otherwise.

  // 2. If same-origin fallback flag is set and mode is "no-cors", set mode to "same-origin".

  // 3. Let credentialsMode be "include".

  // 4. If corsAttributeState is Anonymous, set credentialsMode to "same-origin".

  const request = new Request(url);

  // 5. Let request be a new request whose URL is url, destination is destination, mode is mode, credentials mode is credentialsMode, and whose use-URL-credentials flag is set.
  internalSlots.extends(
    request,
    new RequestInternals({ URL: url, client: null }),
  );

  return request;
}
