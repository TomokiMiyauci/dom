import { toASCIILowerCase } from "../infra/string.ts";

export const JavaScriptMIMETypes = new Set<string>([
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
]);

/**
 * @see [MIME Sniffing living standard](https://mimesniff.spec.whatwg.org/#json-mime-type)
 */
export function isJSONMIMEType(type: string): boolean {
  return type.endsWith("+json") || type === "application/json" ||
    type === "text/json";
}

/**
 * @see [MIME Sniffing living standard](https://mimesniff.spec.whatwg.org/#javascript-mime-type-essence-match)
 */
export function matchJavaScriptMIMETypeEssence(input: string): boolean {
  // if it is an ASCII case-insensitive match for one of the JavaScript MIME type essence strings.
  return JavaScriptMIMETypes.has(toASCIILowerCase(input));
}
