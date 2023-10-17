import { DocumentFragment } from "../document_fragment.ts";
import { Text } from "../text.ts";
import { isSingle, iter } from "./../../deps.ts";
import { appendNode } from "./mutation.ts";
import { data, nodeDocument } from "../../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#converting-nodes-into-a-node
 */
export function convertNodesIntoNode(
  nodes: Iterable<Node | string>,
  document: Document,
): Node {
  // 2. Replace each string in nodes with a new Text node whose data is the string and node document is document.
  const replaced = iter(nodes).map((node) => {
    if (typeof node === "string") {
      const text = new Text();
      text[data] = node, text[nodeDocument] = document;
      return text;
    }

    return node;
  }).toArray();

  // 3. If nodes contains one node, then set node to nodes[0].
  if (isSingle(replaced)) return replaced[0];

  // 1. Let node be null. // 4. Otherwise, set node to a new DocumentFragment node whose node document is document, and then append each node in nodes, if any, to it.
  const fragment = new DocumentFragment();
  fragment[nodeDocument] = document;
  replaced.forEach((node) => appendNode(node, fragment));

  // 5. Return node.
  return fragment;
}
