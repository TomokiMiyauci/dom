import { HTMLElement } from "../dom/html_element.ts";
import type { IHTMLHeadElement } from "../../../interface.d.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/semantics.html#the-head-element
 */
@Exposed("Window", "HTMLHeadElement")
export class HTMLHeadElement extends HTMLElement implements IHTMLHeadElement {}
