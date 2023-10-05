import { $ } from "../../internal.ts";

export function browsingContext(window: Window) {
  // its associated Document's browsing context.
  return $($(window).document).browsingContext;
}
