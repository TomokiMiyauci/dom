const seen = new Set<string>();

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unique-internal-value)
 */
export function uniqueIntervalValue(): string {
  // value that is serializable, comparable by value
  return Math.random().toString(36).substring(2, 10);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#new-unique-internal-value)
 */
export function newUniqueIntervalValue(): string {
  // return a unique internal value that has never previously been returned by this algorithm.
  let value: string;

  do {
    value = uniqueIntervalValue();
  } while (seen.has(value));

  seen.add(value);

  return value;
}
