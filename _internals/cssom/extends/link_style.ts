import { LinkStyle } from "../link_style.ts";
import { ProcessingInstruction } from "../../../dom/nodes/processing_instruction.ts";
import { HTMLStyleElement } from "../../../_internals/html/elements/html_style_element.ts";
import { HTMLLinkElement } from "../../../_internals/html/elements/html_link_element.ts";
import { includes } from "../../../utils.ts";

declare module "../../../dom/nodes/processing_instruction.ts" {
  interface ProcessingInstruction extends LinkStyle {}
}

declare module "../../../_internals/html/elements/html_style_element.ts" {
  interface HTMLStyleElement extends LinkStyle {}
}

declare module "../../../_internals/html/elements/html_link_element.ts" {
  interface HTMLLinkElement extends LinkStyle {}
}

includes(ProcessingInstruction, LinkStyle);
includes(HTMLStyleElement, LinkStyle);
includes(HTMLLinkElement, LinkStyle);
