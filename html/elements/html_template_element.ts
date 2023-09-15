import type { IHTMLTemplateElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { insert } from "../../deps.ts";
import { $, internalSlots } from "../../internal.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
 */
export class HTMLTemplateElement extends HTMLElement
  implements IHTMLTemplateElement {
  constructor(...args: ConstructorParameters<typeof HTMLElement>) {
    super(...args);

    // 1. Let doc be the template element's node document's appropriate template contents owner document.
    const doc = appropriateTemplateContentsOwnerDocument(this._.nodeDocument);

    // 2. Create a DocumentFragment object whose node document is doc and host is the template element.
    const fragment = new DocumentFragment();
    $(fragment).nodeDocument = doc;
    $(fragment).host = this;

    // 3. Set the template element's template contents to the newly created DocumentFragment object.
    const _ = Object.assign(this._, { templateContents: fragment });

    this._ = _;
    internalSlots.set(this, _);
  }

  /**
   * @see https://html.spec.whatwg.org/multipage/scripting.html#dom-template-content
   */
  get content(): DocumentFragment {
    // return the template element's template contents.
    return this._.templateContents;
  }

  declare protected _: HTMLTemplateElementInternals & HTMLElement["_"];
}

export interface HTMLTemplateElementInternals {
  templateContents: DocumentFragment;
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
