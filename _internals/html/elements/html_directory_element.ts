import type { IHTMLDirectoryElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLDirectoryElement")
export class HTMLDirectoryElement extends HTMLElement
  implements IHTMLDirectoryElement {
  get compact(): boolean {
    throw new Error("compact#getter");
  }

  set compact(value: boolean) {
    throw new Error("compact#setter");
  }
}
