import { List } from "../../infra/data_structures/list.ts";
import { BrowsingContext } from "./infrastructure_for_sequences_of_documents/browsing_context.ts";

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
  CSPList: List<unknown> = new List();

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

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#coop-enforcement-result)
 */
export class CrossOriginOpenerPolicyEnforcementResult {
  needsBrowsingContextGroupSwitch = false;

  wouldNeedBrowsingContextGroupSwitchDueToReportOnly = false;

  url: URL;

  origin: Origin;

  crossOriginOpenerPolicy: CrossOriginOpenerPolicy;

  currentContextIsNavigationSource = false;

  constructor(
    { url, origin, crossOriginOpenerPolicy }: Pick<
      CrossOriginOpenerPolicyEnforcementResult,
      "url" | "origin" | "crossOriginOpenerPolicy"
    >,
  ) {
    this.url = url;
    this.origin = origin;
    this.crossOriginOpenerPolicy = crossOriginOpenerPolicy;
  }
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#obtain-browsing-context-navigation)
 */
export function obtainBrowsingContextToUseForNavigationResponse(
  browsingContext: BrowsingContext,
  sandboxFlags: unknown,
  navigationCOOP: unknown,
  coopEnforcementResult: unknown,
): BrowsingContext {
  // 1. If browsingContext is not a top-level browsing context, then return browsingContext.

  // 2. If coopEnforcementResult's needs a browsing context group switch is false, then:

  // 1. If coopEnforcementResult's would need a browsing context group switch due to report-only is true, set browsing context's virtual browsing context group ID to a new unique identifier.

  // 2. Return browsingContext.

  // 3. Let newBrowsingContext be the first return value of creating a new top-level browsing context and document.

  // 4. If navigationCOOP's value is "same-origin-plus-COEP", then set newBrowsingContext's group's cross-origin isolation mode to either "logical" or "concrete". The choice of which is implementation-defined.

  // 5. If sandboxFlags is not empty, then:

  // 1. Assert navigationCOOP's value is "unsafe-none".

  // 2. Assert: newBrowsingContext's popup sandboxing flag set is empty.

  // 3. Set newBrowsingContext's popup sandboxing flag set to a clone of sandboxFlags.

  // 6. Return newBrowsingContext.
  return browsingContext;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#cross-origin-opener-policy-value)
 */
export type CrossOriginOpenerPolicyValue =
  | "unsafe-none"
  | "same-origin-allow-popups"
  | "same-origin"
  | "same-origin-plus-COEP";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#cross-origin-opener-policy)
 */
export class CrossOriginOpenerPolicy {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#coop-struct-value)
   */
  value: CrossOriginOpenerPolicyValue = "unsafe-none";

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#coop-struct-report-endpoint)
   */
  reportingEndpoint: string | null = null;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#coop-struct-report-only-value)
   */
  reportOnlyValue: CrossOriginOpenerPolicyValue = "unsafe-none";

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#coop-struct-report-only-endpoint)
   */
  reportOnlyReportingEndpoint: string | null = null;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#clone-a-policy-container)
 */
export function clonePolicyContainer(
  policyContainer: PolicyContainer,
): PolicyContainer {
  // 1. Let clone be a new policy container.
  const clone = new PolicyContainer();

  // 2. For each policy in policyContainer's CSP list, append a copy of policy into clone's CSP list.
  for (const policy of policyContainer.CSPList) clone.CSPList.append(policy);

  // 3. Set clone's embedder policy to a copy of policyContainer's embedder policy.
  clone.embedderPolicy = policyContainer.embedderPolicy;

  // 4. Set clone's referrer policy to policyContainer's referrer policy.
  clone.referrerPolicy = policyContainer.referrerPolicy;

  // 5. Return clone.
  return clone;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/browsers.html#determining-navigation-params-policy-container)
 */
export function determineNavigationParamsPolicyContainer(
  responseURL: URL,
  historyPolicyContainer: PolicyContainer | null,
  initiatorPolicyContainer: PolicyContainer | null,
  parentPolicyContainer: PolicyContainer | null,
  responsePolicyContainer: PolicyContainer | null,
): PolicyContainer {
  return new PolicyContainer();
}
