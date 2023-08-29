export {
  html,
  parse,
  Token,
  type TreeAdapter,
  type TreeAdapterTypeMap,
} from "npm:parse5@7.1.2";
export {
  every,
  first,
  ifilter,
  imap,
  islice,
  izip,
  map,
  range,
  reduce,
  some,
  takewhile,
} from "npm:itertools@2.1.2";
import { enumerate, find } from "npm:itertools@2.1.2";
export { default as xmlValidator } from "npm:xml-name-validator@4.0.0";
export { initLast } from "https://deno.land/x/seqtools@1.0.0/init_last.ts";
export { insert } from "https://deno.land/x/upsert@1.2.0/mod.ts";
export {
  Err,
  isOk,
  Ok,
  type Result,
} from "https://deno.land/x/result_js@2.0.0/mod.ts";
export { default as isNegativeZero } from "npm:is-negative-zero";
export { isSingle } from "https://deno.land/x/isx@1.5.0/iterable/is_single.ts";
export { enumerate, find };

export type Public<T> = { [k in keyof T]: T[k] };

export type PartialBy<T, U = keyof T> = Omit<
  Partial<Pick<T, U & keyof T>> & Omit<T, U & keyof T>,
  never
>;

export function* tail<T>(iterable: IterableIterator<T>): IterableIterator<T> {
  const iterator = iterable[Symbol.iterator]();

  iterator.next();

  for (const item of iterator) yield item;
}

export function isNotNull<T>(input: T): input is Exclude<T, null> {
  return input !== null;
}

export type Constructor<R = {}> = abstract new (...args: any[]) => R;

/** Return number of yielding items. */
export function len(iterable: Iterable<unknown>): number {
  let count = 0;

  const iterator = iterable[Symbol.iterator]();

  while (!iterator.next().done) count++;

  return count;
}

/** Return last item of {@linkcode iterable}. */
export function last<T>(iterable: Iterable<T>): T | undefined {
  let lastItem: T | undefined;

  for (const item of iterable) lastItem = item;

  return lastItem;
}

export function divide(input: string, delimiter: string): [string, string] {
  if (!delimiter) return [input, ""];
  const pos = input.indexOf(delimiter);

  if (pos > -1) return [input.slice(0, pos), input.slice(pos + 1)];

  return [input, ""];
}

export function at<T>(
  iterable: globalThis.Iterable<T>,
  index: number,
): T | undefined {
  const indexed = enumerate(iterable);
  const entry = find(indexed, (entry) => entry[0] === index);

  return entry ? entry[1] : undefined;
}

/** Returns an iterator that drops elements from the iterable as long as the
 * predicate is true; afterwards, returns every remaining element.  Note, the
 * iterator does not produce any output until the predicate first becomes
 * false.
 */
export function* dropwhile<T>(
  iterable: Iterable<T>,
  predicate: (v: T) => boolean,
): Iterable<T> {
  let hit = false;

  for (const value of iterable) {
    if (hit) yield value;
    if (!predicate(value)) {
      yield value;
      hit = true;
    }
  }
}
