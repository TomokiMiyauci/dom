import { OrderedSet } from "../infra/set.ts";
import { reAsciiWhitespace } from "../infra/code_point.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-ordered-set-serializer
 */
export function serializeOrderSet(set: Iterable<string>): string {
  // returns the concatenation of set using U+0020 SPACE.
  return [...set].join(" ");
}

/**
 * @see https://dom.spec.whatwg.org/#concept-ordered-set-parser
 */
export function parseOrderSet(input: string): OrderedSet<string> {
  // https://infra.spec.whatwg.org/#split-on-ascii-whitespace
  // 1. Let inputTokens be the result of splitting input on ASCII whitespace.
  const inputTokens = input.split(reAsciiWhitespace).filter((x) => x);

  // 2. Let tokens be a new ordered set. 3. For each token in inputTokens, append token to tokens. 4. Return tokens.
  return new OrderedSet(inputTokens);
}
