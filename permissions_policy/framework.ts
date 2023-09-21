type Features = unknown;

/**
 * @see [W3C Permissions Policy](https://w3c.github.io/webappsec-permissions-policy/#permissions-policy)
 */
export class PermissionPolicy {
  /**
   * @see [W3C Permissions Policy](https://w3c.github.io/webappsec-permissions-policy/#permissions-policy-inherited-policy)
   */
  inheritedPolicy: Map<Features, "Enabled" | "Disabled">;

  /**
   * @see [W3C Permissions Policy](https://w3c.github.io/webappsec-permissions-policy/#permissions-policy-declared-policy)
   */
  declaredPolicy: Map<Features, "Enabled" | "Disabled">;

  constructor({ inheritedPolicy, declaredPolicy }: PermissionPolicy) {
    this.inheritedPolicy = inheritedPolicy;
    this.declaredPolicy = declaredPolicy;
  }
}
