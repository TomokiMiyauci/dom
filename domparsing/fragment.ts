import type { Element } from "../nodes/element.ts";
import { $create, $nodeDocument } from "../nodes/internal.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { parseHTMLFragment } from "../html/html_parser.ts";
import { orderTreeChildren } from "../trees/tree.ts";
import { appendNode } from "../nodes/mutation.ts";

/**
 * @see https://w3c.github.io/DOM-Parsing/#dfn-fragment-parsing-algorithm
 */
export function parseFragment(
  markup: string,
  contextElement: Element,
): DocumentFragment {
  // 1. If the context element's node document is an HTML document: let algorithm be the HTML fragment parsing algorithm.
  //    If the context element's node document is an XML document: let algorithm be the XML fragment parsing algorithm.
  const algorithm = contextElement[$nodeDocument]._type === "html"
    ? parseHTMLFragment
    : (() => {
      throw new Error();
    })();

  // 2. Let new children be the result of invoking algorithm with markup as the input, and context element as the context element.
  const newChildren = algorithm(contextElement, markup);

  // 3. Let fragment be a new DocumentFragment whose node document is context element's node document.
  const fragment = DocumentFragment[$create]({
    nodeDocument: contextElement[$nodeDocument],
  });

  // 4. Append each Node in new children to fragment (in tree order).
  for (const node of orderTreeChildren(newChildren)) appendNode(node, fragment);

  // 5. Return the value of fragment.
  return fragment;
}
