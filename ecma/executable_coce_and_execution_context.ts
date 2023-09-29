/**
 * @see [ECMAScript Language Specification](https://tc39.es/ecma262/#table-realm-record-fields)
 */
export interface RealmRecord {
  "[[AgentSignifier]]": Agent;
  "[[Intrinsics]]": unknown;
  "[[GlobalObject]]": object | undefined;
  "[[HostDefined]]": unknown;
}

export interface Agent {
}
