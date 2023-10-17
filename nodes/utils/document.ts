import { isElement } from "./type.ts";
import { iter } from "../../deps.ts";
import { $, tree } from "../../internal.ts";
import { isCustom } from "./element.ts";
import { enqueueCustomElementCallbackReaction } from "../../_internals/html/elements/custom_elements/custom_element_reaction.ts";
import { removeNode } from "./mutation.ts";
import { attributeList } from "../../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-adopt
 */
export function adoptNode(node: Node, document: Document): void {
  // 1. Let oldDocument be node’s node document.
  const oldDocument = $(node).nodeDocument;

  // 2. If node’s parent is non-null, then remove node.
  if (tree.parent(node)) removeNode(node);

  // 3. If document is not oldDocument, then:
  if (document !== oldDocument) {
    // 1. For each inclusiveDescendant in node’s shadow-including inclusive descendants:
    for (
      const inclusiveDescendant of tree.shadowIncludingInclusiveDescendants(
        node,
      )
    ) {
      // 1. Set inclusiveDescendant’s node document to document.
      $(inclusiveDescendant).nodeDocument = document;

      // 2. If inclusiveDescendant is an element,
      if (isElement(inclusiveDescendant)) {
        // then set the node document of each attribute in inclusiveDescendant’s attribute list to document.
        iter(inclusiveDescendant[attributeList]).forEach((attr) =>
          $(attr).nodeDocument = document
        );
      }
    }
  }

  const shadowIncludingInclusiveDescendants = tree
    .shadowIncludingInclusiveDescendants(node);
  // 2. For each inclusiveDescendant in node’s shadow-including inclusive descendants that is custom,
  for (
    const inclusiveDescendant of iter(shadowIncludingInclusiveDescendants)
      .filter(isElement).filter(isCustom)
  ) {
    // enqueue a custom element callback reaction with inclusiveDescendant,
    enqueueCustomElementCallbackReaction(
      inclusiveDescendant,
      // callback name "adoptedCallback",
      "adoptedCallback",
      //  and an argument list containing oldDocument and document.
      [oldDocument, document],
    );
  }

  // 3. For each inclusiveDescendant in node’s shadow-including inclusive descendants, in shadow-including tree order,
  for (const inclusiveDescendant of shadowIncludingInclusiveDescendants) {
    // run the adopting steps with inclusiveDescendant and oldDocument.
    $(node).adoptingSteps.run(inclusiveDescendant, oldDocument);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#html-document
 */
export function isHTMLDocument(document: globalThis.Document): boolean {
  // type is "xml"; otherwise an HTML document.
  return $(document).type !== "xml";
}
