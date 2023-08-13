export {
  html,
  parse,
  Token,
  type TreeAdapter,
  type TreeAdapterTypeMap,
} from "npm:parse5";
export { enumerate, find, ifilter, imap } from "npm:itertools";

export type Public<T> = { [k in keyof T]: T[k] };

export function* tail<T>(iterable: IterableIterator<T>): IterableIterator<T> {
  const iterator = iterable[Symbol.iterator]();

  iterator.next();

  for (const item of iterator) yield item;
}

export function isNotNull<T>(input: T): input is Exclude<T, null> {
  return input !== null;
}

export type Constructor = new (...args: any[]) => {};
