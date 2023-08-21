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
