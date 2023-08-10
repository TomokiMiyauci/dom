import type { IHTMLTemplateElement } from "../interface.d.ts";

export class HTMLTemplateElement extends HTMLElement
  implements IHTMLTemplateElement {
  get content(): DocumentFragment {
    return new DocumentFragment();
  }
}
