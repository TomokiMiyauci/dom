export {
  html,
  parse,
  Token,
  type TreeAdapter,
  type TreeAdapterTypeMap,
} from "npm:parse5";
export { find, ifilter } from "npm:itertools";

export type Public<T> = { [k in keyof T]: T[k] };
