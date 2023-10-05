import { $ } from "../internal.ts";
import * as DOM from "../../internal.ts";

export function browsingContext(window: Window) {
  // its associated Document's browsing context.
  return DOM.$($(window).document).browsingContext;
}
