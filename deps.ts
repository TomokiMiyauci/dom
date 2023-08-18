export {
  html,
  parse,
  Token,
  type TreeAdapter,
  type TreeAdapterTypeMap,
} from "npm:parse5";
export {
  enumerate,
  every,
  find,
  first,
  ifilter,
  imap,
  islice,
  izip,
  some,
  takewhile,
} from "npm:itertools";

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
