import type { IHTMLDataListElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLDataListElement")
export class HTMLDataListElement extends HTMLElement
  implements IHTMLDataListElement {
  get options(): HTMLCollectionOf<HTMLOptionElement> {
    throw new Error("options#getter");
  }
}
