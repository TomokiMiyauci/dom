import {
  OpaqueOrigin,
  Origin,
  TupleOrigin,
} from "../html/loading_web_pages/supporting_concepts.ts";
import { URLSerializer } from "./serializer.ts";

/**
 * @see [URL living standard](https://url.spec.whatwg.org/#concept-url-equals)
 */
export function equalsURL(a: URL, b: URL, excludeFragments = false): boolean {
  // 1. Let serializedA be the result of serializing A, with exclude fragment set to exclude fragments.
  const serializedA = URLSerializer.serialize(a, excludeFragments);

  // 2. Let serializedB be the result of serializing B, with exclude fragment set to exclude fragments.
  const serializedB = URLSerializer.serialize(b, excludeFragments);

  // 3. Return true if serializedA is serializedB; otherwise false.
  return serializedA === serializedB;
}

/**
 * @see [URL living standard](https://url.spec.whatwg.org/#concept-url-origin)
 */
export function origin(url: URL): Origin {
  switch (url.protocol) {
    case "ftp":
    case "http":
    case "https":
    case "ws":
    case "wss": {
      return <TupleOrigin> [url.protocol, url.host, Number(url.port), null];
    }
    default:
      return new OpaqueOrigin();
  }
}
