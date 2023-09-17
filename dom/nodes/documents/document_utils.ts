import { $ } from "../../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#html-document
 */
export function isHTMLDocument(document: globalThis.Document): boolean {
  // type is "xml"; otherwise an HTML document.
  return $(document).type !== "xml";
}
