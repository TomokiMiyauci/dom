import { isDocumentFragment } from "./utils.ts";
import { type Node } from "./node.ts";
import { type Document } from "./document.ts";
import { $nodeDocument } from "./internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
export function replaceNode(child: Node | null, parent: Node): void {}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-insert
 */
export function insertNode(
  node: Node,
  parent: Node,
  child: Child,
  suppressObservers: boolean | null = null,
) {
  // 1. Let nodes be node’s children, if node is a DocumentFragment node; otherwise « node ».
  // TODO
  const nodes = isDocumentFragment(node) ? node.children : new Set([node]);

  // 2. Let count be nodes’s size.
  const count = nodes.size;

  // 3. If count is 0, then return.
  if (!count) return;

  // 4. If node is a DocumentFragment node, then:
  if (isDocumentFragment(node)) {
    // 1. Remove its children with the suppress observers flag set.
    removeNode(node._children, suppressObservers);

    // 2. Queue a tree mutation record for node with « », nodes, null, and null.
  }

  // 5. If child is non-null, then:
  if (child) {
    // 1. For each live range whose start node is parent and start offset is greater than child’s index, increase its start offset by count.
    // 2. For each live range whose end node is parent and end offset is greater than child’s index, increase its end offset by count.
  }

  // 6. Let previousSibling be child’s previous sibling or parent’s last child if child is null.
  const previousSibling = child ? child.previousSibling : parent.lastChild;

  // 7. For each node in nodes, in tree order:
  for (const node of nodes) {
    // 1. Adopt node into parent’s node document.
    adoptNode(node, parent.ownerDocument);

    // 2. If child is null, then append node to parent’s children.
    if (child === null) {
      parent._children.append(node);
    } else {
      // 3. Otherwise, insert node into parent’s children before child’s index.
      parent._children.insert(node, child.index);
    }

    // 4. If parent is a shadow host whose shadow root’s slot assignment is "named" and node is a slottable, then assign a slot for node.

    // 5. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.

    // 6. Run assign slottables for a tree with node’s root.

    // 7. For each shadow-including inclusive descendant inclusiveDescendant of node, in shadow-including tree order:
    //// 1. Run the insertion steps with inclusiveDescendant.
    //// 2. If inclusiveDescendant is connected, then:
    ///// 1. If inclusiveDescendant is custom, then enqueue a custom element callback reaction with inclusiveDescendant, callback name "connectedCallback", and an empty argument list.

    ///// 2. Otherwise, try to upgrade inclusiveDescendant.
  }

  // 8. If suppress observers flag is unset, then queue a tree mutation record for parent with nodes, « », previousSibling, and child.

  // 9. Run the children changed steps for parent.
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function ensurePreInsertionValidity(
  node: Node,
  parent: Node,
  child: Child,
): never {
  // 1. If parent is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.

  // 2. If node is a host-including inclusive ancestor of parent, then throw a "HierarchyRequestError" DOMException.

  // 3. If child is non-null and its parent is not parent, then throw a "NotFoundError" DOMException.

  // 4. If node is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.

  // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is not a document, then throw a "HierarchyRequestError" DOMException.

  // 6. If parent is a document, and any of the statements below, switched on the interface node implements, are true, then throw a "HierarchyRequestError" DOMException.

  // DocumentFragment
  // If node has more than one element child or has a Text node child.

  // Otherwise, if node has one element child and either parent has an element child, child is a doctype, or child is non-null and a doctype is following child.

  // Element
  // parent has an element child, child is a doctype, or child is non-null and a doctype is following child.

  // DocumentType
  // parent has a doctype child, child is non-null and an element is preceding child, or child is null and parent has an element child.
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-pre-insert
 */
export function preInsertNode(
  node: Node,
  parent: Node,
  child: Child,
) {
  // 1. Ensure pre-insertion validity of node into parent before child.
  ensurePreInsertionValidity(node, parent, child);

  // 2. Let referenceChild be child.
  let referenceChild = child;

  // 3. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild !== null) {
    referenceChild = referenceChild!.nextSibling;
  }

  // 4. Insert node into parent before referenceChild.
  insertNode(node, parent, referenceChild);

  // 5. Return node.
  return node;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-remove
 */
export function removeNode(node: Node, isSurpressObservers?: boolean) {}

/** To append a node to a parent, pre-insert node into parent before null.
 * @see https://dom.spec.whatwg.org/#concept-node-append
 */
export function appendNode(node: Node, parent: Node): Node {
  // To append a node to a parent, pre-insert node into parent before null.
  return preInsertNode(node, parent, null);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-adopt
 */
export function adoptNode(node: Node, document: Document): void {
  // 1. Let oldDocument be node’s node document.
  const oldDocument = node[$nodeDocument];

  // 2. If node’s parent is non-null, then remove node.
  if (node._parent !== null) removeNode(node);

  // 3. If document is not oldDocument, then:
  if (document !== oldDocument) {
    // 1. For each inclusiveDescendant in node’s shadow-including inclusive descendants:

    // 1. Set inclusiveDescendant’s node document to document.
    // 2. If inclusiveDescendant is an element, then set the node document of each attribute in inclusiveDescendant’s attribute list to document.
  }

  // 2. For each inclusiveDescendant in node’s shadow-including inclusive descendants that is custom, enqueue a custom element callback reaction with inclusiveDescendant, callback name "adoptedCallback", and an argument list containing oldDocument and document.

  // 3. For each inclusiveDescendant in node’s shadow-including inclusive descendants, in shadow-including tree order, run the adopting steps with inclusiveDescendant and oldDocument.
}
