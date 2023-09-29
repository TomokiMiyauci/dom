import { RealmRecord } from "./executable_coce_and_execution_context.ts";

/**
 * @see [ECMAScript Language Specification](https://tc39.es/ecma262/#table-realm-record-fields)
 */
export interface ScriptRecord {
  "[[Realm]]": RealmRecord | undefined;
  "[[ECMAScriptCode]]": string;
}

/**
 * @see [ECMAScript Language Specification](https://tc39.es/ecma262/#sec-parse-script)
 */
export function ParseScript(
  sourceText: string,
  realm: RealmRecord | undefined,
  hostDefined: unknown,
): ScriptRecord {
  return {
    "[[ECMAScriptCode]]": sourceText,
    "[[Realm]]": realm,
  };
}
