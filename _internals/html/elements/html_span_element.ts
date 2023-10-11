import type { IHTMLSpanElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLSpanElement")
export class HTMLSpanElement extends HTMLElement implements IHTMLSpanElement {}
