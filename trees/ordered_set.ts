/**
 * @see https://dom.spec.whatwg.org/#concept-ordered-set-serializer
 */
export function serializeOrderSet(set: Iterable<string>): string {
  // returns the concatenation of set using U+0020 SPACE.
  return [...set].join(" ");
}
