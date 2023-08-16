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
  ifilter,
  imap,
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
