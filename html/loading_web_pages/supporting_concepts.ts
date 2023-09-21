/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin)
 */

export class OpaqueOrigin {}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin-tuple)
 */
export type TupleOrigin = [
  scheme: string,
  host: unknown,
  port: number | null,
  domain: unknown | null,
];

export function sameOrigin(A: Origin, B: Origin): boolean {
  if (A === B) return true;

  // 1. If A and B are the same opaque origin, then return true.
  if (isOpaqueOrigin(A) && isOpaqueOrigin(B)) return true;

  // 2. If A and B are both tuple origins and their schemes, hosts, and port are identical, then return true.
  if (
    isTupleOrigin(A) && isTupleOrigin(B) && A[0] === B[0] && A[1] === B[1] &&
    A[2] === B[2]
  ) return true;

  // 3. Return false.
  return false;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#same-origin-domain)
 */
export function sameOriginDomain(A: Origin, B: Origin): boolean {
  if (A === B) return true;

  // 1. If A and B are the same opaque origin, then return true.
  if (isOpaqueOrigin(A) && isOpaqueOrigin(B)) return true;

  // 2. If A and B are both tuple origins, run these substeps:
  if (isTupleOrigin(A) && isTupleOrigin(B)) {
    // 1. If A and B's schemes are identical, and their domains are identical and non-null, then return true.
    if (A[0] === B[0] && A[3] === B[3] && A[0] !== null) return true;

    // 2. Otherwise, if A and B are same origin and their domains are identical and null, then return true.
    if (sameOrigin(A, B) && A[3] === B[3] && A[3] === null) return true;
  }

  // 3. Return false.
  return false;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#determining-the-creation-sandboxing-flags)
 */
export function determineCreationSandboxingFlags(
  browsingContext: unknown,
  embedder: Element | null,
): unknown {
  // TODO
  return;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#policy-container)
 */
export class PolicyContainer {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#policy-container-csp-list)
   */
  CSPList: unknown[] = [];

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#policy-container-embedder-policy)
   */
  embedderPolicy: EmbedderPolicy = new EmbedderPolicy();

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#policy-container-referrer-policy)
   */
  referrerPolicy: ReferrerPolicy = "strict-origin-when-cross-origin";
}

class EmbedderPolicy {
}

export type Origin = OpaqueOrigin | TupleOrigin;

export function isOpaqueOrigin(origin: Origin): origin is OpaqueOrigin {
  return origin instanceof OpaqueOrigin;
}

export function isTupleOrigin(origin: Origin): origin is TupleOrigin {
  return Array.isArray(origin);
}
