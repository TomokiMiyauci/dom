import * as DOM from "../../internal.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#unblock-rendering)
 */
export function unblockRendering(el: Element) {
  // 1. Let document be el's node document.
  const document = DOM.$(el).nodeDocument;

  // 2. Remove el from document's render-blocking element set.
  DOM.$(document).renderBlockingElementSet.remove((item) => item === el);
}
