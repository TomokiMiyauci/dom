import { insert } from "../../deps.ts";
import { Document } from "../../dom/nodes/documents/document.ts";

const documentMap = new WeakMap<globalThis.Document, globalThis.Document>();

/**
 * @see https://html.spec.whatwg.org/multipage/scripting.html#appropriate-template-contents-owner-document
 */
export function appropriateTemplateContentsOwnerDocument(
  document: globalThis.Document,
): globalThis.Document {
  return insert(documentMap, document, () => new Document());
}
