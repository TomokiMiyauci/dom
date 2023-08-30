import { range } from "../deps.ts";

/** Match unicode safe case insensitive.
 * @see https://infra.spec.whatwg.org/#ascii-case-insensitive
 */
export function matchASCIICaseInsensitive(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  for (const i of range(0, a.length)) {
    if ((a.charCodeAt(i) | 32) !== (b.charCodeAt(i) | 32)) return false;
  }

  return true;
}

/**
 * @see https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
 */
export function stripAndCollapseASCIIWhitespace(input: string): string {
  // replace any sequence of one or more consecutive code points that are ASCII whitespace in the string with a single U+0020 SPACE code point, and then remove any leading and trailing ASCII whitespace from that string.
  return input
    .replace(/[ \t\n\f\r]+/g, " ")
    .replace(/^[ \t\n\f\r]+/, "")
    .replace(/[ \t\n\f\r]+$/, "");
}
