import type { IHTMLUnknownElement } from "../../../interface.d.ts";
import { HTMLElement } from "./html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLUnknownElement")
export class HTMLUnknownElement extends HTMLElement
  implements IHTMLUnknownElement {
}
