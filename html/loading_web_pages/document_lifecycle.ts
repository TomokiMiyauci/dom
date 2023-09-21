import { appendNode } from "../../dom/nodes/node_trees/mutation.ts";
import { createElement } from "../../dom/nodes/utils/create_element.ts";
import { Namespace } from "../../infra/namespace.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/document-lifecycle.html#populate-with-html/head/body)
 */
export function populateHTMLHeadBody(document: Document): void {
  // 1. Let html be the result of creating an element given document, html, and the HTML namespace.
  const html = createElement(document, "html", Namespace.HTML);

  // 2. Let head be the result of creating an element given document, head, and the HTML namespace.
  const head = createElement(document, "head", Namespace.HTML);

  // 3. Let body be the result of creating an element given document, body, and the HTML namespace.
  const body = createElement(document, "body", Namespace.HTML);

  // 4. Append html to document.
  appendNode(html, document);

  // 5. Append head to html.
  appendNode(head, html);

  // 6. Append body to html.
  appendNode(body, html);
}
