import type { IHTMLTemplateElement } from "../../interface.d.ts";
import { DocumentFragment } from "../../dom/nodes/document_fragment.ts";
import { Document } from "../../dom/nodes/documents/document.ts";
import { $nodeDocument, $templateContents } from "../../dom/nodes/internal.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { insert } from "../../deps.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
 */
export class HTMLTemplateElement extends HTMLElement
  implements IHTMLTemplateElement {
  [$templateContents]: DocumentFragment;

  constructor(...args: ConstructorParameters<typeof HTMLElement>) {
    super(...args);

    // 1. Let doc be the template element's node document's appropriate template contents owner document.
    const doc = appropriateTemplateContentsOwnerDocument(this[$nodeDocument]);

    // 2. Create a DocumentFragment object whose node document is doc and host is the template element.
    const fragment = new DocumentFragment();
    fragment[$nodeDocument] = doc;
    fragment["_host"] = this;

    // 3. Set the template element's template contents to the newly created DocumentFragment object.
    this[$templateContents] = fragment;
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/scripting.html#dom-template-content
   */
  get content(): DocumentFragment {
    // return the template element's template contents.
    return this[$templateContents];
  }
}

const documentMap = new WeakMap<Document, Document>();

/**
 * @see https://html.spec.whatwg.org/multipage/scripting.html#appropriate-template-contents-owner-document
 */
function appropriateTemplateContentsOwnerDocument(
  document: Document,
): Document {
  return insert(documentMap, document, () => new Document());
}
