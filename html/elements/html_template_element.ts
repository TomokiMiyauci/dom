import type { IHTMLTemplateElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTemplateElement extends HTMLElement
  implements IHTMLTemplateElement {
  get content(): DocumentFragment {
    throw new Error("content#getter");
  }
}
