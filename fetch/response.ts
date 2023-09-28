import { internalSlots } from "../html/internal.ts";

export class ResponseInternals {
  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-response-type)
   */
  type: ResponseType = "default";

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-response-url)
   */
  url: URL | null = null;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-response-status)
   */
  status = 200;

  /**
   * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-response-status-message)
   */
  statusMessage = ""; // TODO
}

/**
 * @see [Fetch Living Standard](https://fetch.spec.whatwg.org/#concept-network-error)
 */
export function networkError(): Response {
  const response = new Response(null, { status: 0 });
  const internals = new ResponseInternals();

  internals.type = "error";
  internals.status = 0;

  internalSlots.extends(response, internals);

  return response;
}
