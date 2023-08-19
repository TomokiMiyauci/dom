import { HTMLElement } from "../dom/html_element.ts";
import type { IHTMLHeadElement } from "../../interface.d.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/semantics.html#the-head-element
 */
export class HTMLHeadElement extends HTMLElement implements IHTMLHeadElement {}
