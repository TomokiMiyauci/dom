import type { IHTMLTemplateElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { $ } from "../../internal.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
 */
export class HTMLTemplateElement extends HTMLElement
  implements IHTMLTemplateElement {
  /**
   * @see https://html.spec.whatwg.org/multipage/scripting.html#dom-template-content
   */
  get content(): DocumentFragment {
    // return the template element's template contents.
    return this.#_.templateContents;
  }

  get #_() {
    return $<HTMLTemplateElement>(this);
  }
}

export interface HTMLTemplateElementInternals {
  templateContents: DocumentFragment;
}
