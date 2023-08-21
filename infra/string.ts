import { range } from "../deps.ts";

/**
 * @see https://infra.spec.whatwg.org/#ascii-case-insensitive
 */
export function matchASCIICaseInsensitive(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  for (const index of range(a.length)) {
    if (a.charCodeAt(index) !== b.charCodeAt(index)) return false;
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
