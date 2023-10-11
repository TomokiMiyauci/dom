import { DocumentFragment } from "../../dom/nodes/document_fragment.ts";
import { parseHTMLFragment } from "../html/html_parser.ts";
import { appendNode } from "../../dom/nodes/node_trees/mutation.ts";
import { isHTMLDocument } from "../../dom/nodes/documents/document_utils.ts";
import { serialize } from "npm:parse5@7.1.2";
import { DOMTreeAdapter, DOMTreeAdapterMap } from "../html/_adapter.ts";
import { $ } from "../../internal.ts";

/**
 * @see https://w3c.github.io/DOM-Parsing/#dfn-fragment-parsing-algorithm
 */
export function parseFragment(
  markup: string,
  contextElement: Element,
): globalThis.DocumentFragment {
  // 1. If the context element's node document is an HTML document: let algorithm be the HTML fragment parsing algorithm.
  //    If the context element's node document is an XML document: let algorithm be the XML fragment parsing algorithm.
  const algorithm = isHTMLDocument($(contextElement).nodeDocument)
    ? parseHTMLFragment
    : (() => {
      throw new Error("parseFragment");
    })();

  // 2. Let new children be the result of invoking algorithm with markup as the input, and context element as the context element.
  const newChildren = algorithm(contextElement, markup);

  // 3. Let fragment be a new DocumentFragment whose node document is context element's node document.
  const fragment = new DocumentFragment();
  $(fragment).nodeDocument = $(contextElement).nodeDocument;

  // 4. Append each Node in new children to fragment (in tree order).
  for (const node of newChildren) appendNode(node, fragment);

  // 5. Return the value of fragment.
  return fragment;
}

/**
 * @see https://w3c.github.io/DOM-Parsing/#dfn-fragment-serializing-algorithm
 */
export function serializeFragment(
  node: Node,
  requireWellFormed: boolean,
): string {
  // 1. Let context document be the value of node's node document.
  const contextDocument = $(node).nodeDocument;

  // 2. If context document is an HTML document, return an HTML serialization of node.
  if (isHTMLDocument(contextDocument)) {
    return serialize<DOMTreeAdapterMap>(node as any, {
      treeAdapter: new DOMTreeAdapter(contextDocument),
    });
  }

  // 3. Otherwise, context document is an XML document; return an XML serialization of node passing the flag require well-formed.
  throw new Error("XML serialization is not supported");
}
