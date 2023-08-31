import { range } from "../deps.ts";

/** Return ASCII lowercase.
 * @see https://infra.spec.whatwg.org/#ascii-lowercase
 */
export function toASCIILowerCase(string: string): string {
  // replace all ASCII upper alphas in the string with their corresponding code point in ASCII lower alpha.
  let result = "";

  for (const char of string) {
    const value = char.charCodeAt(0);

    if (65 <= value && value <= 90) result += String.fromCharCode(value + 32);
    else result += char;
  }

  return result;
}

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

/**
 * @see https://infra.spec.whatwg.org/#javascript-string-convert
 */
export function convertScalar(input: string): string {
  return input.replace(/[\uD800-\uDFFF]/g, "\uFFFD");
}

function substringCodeUnit(
  string: string,
  start: number,
  length: number,
): string {
  if (
    0 <= start && start <= start + length && start + length <= string.length
  ) {
    let result = "";

    for (const i of range(start, start + length - 1)) {
      result += String.fromCodePoint(string.codePointAt(i)!);
    }

    return result;
  }
  throw new Error();
}

function substringCodeUnitByPositions(
  string: string,
  start: number,
  end: number,
) {
  return substringCodeUnit(string, start, end - start);
}

export function substringCodeUnitToEnd(string: string, start: number): string {
  return substringCodeUnitByPositions(string, start, string.length);
}
