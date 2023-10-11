import { Origin } from "../html/loading_web_pages/supporting_concepts.ts";
import { PermissionPolicy } from "./framework.ts";

/**
 * @see [W3C Permissions Policy](https://w3c.github.io/webappsec-permissions-policy/#create-for-navigable)
 */
export function createPermissionPolicyForNavigable(
  container: Element | null,
  origin: Origin,
): PermissionPolicy {
  // 1. Assert: If not null, container is a navigable container.

  // 2. Let inherited policy be a new ordered map.
  const inheritedPolicy = new Map();

  // 3. For each feature supported,

  // 1. Let isInherited be the result of running Define an inherited policy for feature in container at origin on feature, container and origin.

  // 2. Set inherited policy[feature] to isInherited.

  // 4. Let policy be a new permissions policy, with inherited policy inherited policy and declared policy a new ordered map.
  const policy = new PermissionPolicy({
    inheritedPolicy,
    declaredPolicy: new Map(),
  });

  // 5. Return policy.
  return policy;
}
