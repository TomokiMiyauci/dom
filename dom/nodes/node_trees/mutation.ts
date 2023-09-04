import {
  isCharacterData,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isShadowHost,
  isShadowRoot,
  isText,
} from "../utils.ts";
import { type Node, NodeType } from "../node.ts";
import { type Document } from "../documents/document.ts";
import { $nodeDocument, $shadowRoot, $slotAssignment } from "../internal.ts";
import { OrderedSet } from "../../../infra/data_structures/set.ts";
import { DOMExceptionName } from "../../../webidl/exception.ts";
import {
  getFollows,
  getInclusiveAncestors,
  getInclusiveDescendants,
  getIndex,
  getLastChild,
  getNextSibling,
  getPrecedings,
  getPreviousSibling,
  getRoot,
  hasParent,
} from "../../trees/tree.ts";
import type { Child, Parent } from "../types.ts";
import { isHostIncludingInclusiveAncestorOf } from "../document_fragment_algorithm.ts";
import { filter, find, some } from "../../../deps.ts";
import {
  assignSlot,
  isSlottable,
  signalSlotChange,
} from "../node_trees/node_tree.ts";
import { queueTreeMutationRecord } from "../mutation_observers/queue.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-node-replace
 */
export function replaceChild<T extends Node>(
  child: T,
  node: Node,
  parent: Node,
): T {
  // 1. If parent is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
  if (
    !(isDocument(parent) || isDocumentFragment(parent) || isElement(parent))
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 2. If node is a host-including inclusive ancestor of parent, then throw a "HierarchyRequestError" DOMException.
  if (isHostIncludingInclusiveAncestorOf(node, parent)) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  // 3. If child’s parent is not parent, then throw a "NotFoundError" DOMException.
  if (child._parent !== parent) {
    throw new DOMException("<message>", DOMExceptionName.NotFoundError);
  }

  // 4. If node is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
  if (
    !(isDocumentFragment(node) ||
      isDocumentType(node) ||
      isElement(node) ||
      isCharacterData(node))
  ) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is not a document, then throw a "HierarchyRequestError" DOMException.
  if (
    (isText(node) && isDocument(parent)) ||
    (isDocumentType(node) && !isDocument(parent))
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 6. If parent is a document, and any of the statements below, switched on the interface node implements, are true, then throw a "HierarchyRequestError" DOMException.
  if (isDocument(parent) && checkNode(node)) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  function checkNode(node: Node): boolean {
    switch (node.nodeType) {
      case NodeType.DOCUMENT_FRAGMENT_NODE: {
        // If node has more than one element child or has a Text node child.
        const elementsCount = filter(node._children, isElement).length;

        if (elementsCount > 1 || find(node._children, isText)) return true;

        // Otherwise, if node has one element child and either parent has an element child that is not child or a doctype is following child.
        if (
          elementsCount === 1 && (
            some(
              filter(parent._children, isElement),
              (value) => !Object.is(value, child),
            ) ||
            some(getFollows(child), isDocumentType)
          )
        ) return true;

        return false;
      }

      case NodeType.ELEMENT_NODE: {
        // parent has an element child that is not child or a doctype is following child.
        const element = find(parent._children, isElement);

        return (element && !Object.is(element, child)) ||
          some(getFollows(child), isDocumentType);
      }

      case NodeType.DOCUMENT_TYPE_NODE: {
        // parent has a doctype child that is not child, or an element is preceding child.
        const doctype = find(parent._children, isDocumentType);

        return ((doctype && !Object.is(doctype, child)) ||
          some(getPrecedings(child), isElement));
      }

      default:
        return false;
    }
  }

  // 7. Let referenceChild be child’s next sibling.
  let referenceChild = getNextSibling(child);

  // 8. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) referenceChild = getNextSibling(node);

  // 9. Let previousSibling be child’s previous sibling.
  const previousSibling = getPreviousSibling(child);

  // 10. Let removedNodes be the empty set.
  let removedNodes = new OrderedSet<Node>();

  // 11. If child’s parent is non-null, then:
  if (child._parent) {
    // 1. Set removedNodes to « child ».
    removedNodes = new OrderedSet([child]);

    // 2. Remove child with the suppress observers flag set.
    removeNode(child, true);
  }

  // 12. Let nodes be node’s children if node is a DocumentFragment node; otherwise « node ».
  const nodes = isDocumentFragment(node)
    ? node._children
    : new OrderedSet([node]);

  // 13. Insert node into parent before referenceChild with the suppress observers flag set.
  insertNode(node, parent, referenceChild, true);

  // 14. Queue a tree mutation record for parent with nodes, removedNodes, previousSibling, and referenceChild.
  queueTreeMutationRecord(
    parent,
    nodes,
    removedNodes,
    previousSibling,
    referenceChild,
  );

  // 15. Return child.
  return child;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-insert
 */
export function insertNode(
  node: Node,
  parent: Node,
  child: Child | null,
  suppressObservers: boolean | null = null,
) {
  // 1. Let nodes be node’s children, if node is a DocumentFragment node; otherwise « node ».
  const nodes = isDocumentFragment(node)
    ? node._children.clone()
    : new OrderedSet<Node>([node]);

  // 2. Let count be nodes’s size.
  const count = nodes.size;

  // 3. If count is 0, then return.
  if (!count) return;

  // 4. If node is a DocumentFragment node, then:
  if (isDocumentFragment(node)) {
    // 1. Remove its children with the suppress observers flag set.
    for (const child of node._children) removeNode(child, suppressObservers);

    // 2. Queue a tree mutation record for node with « », nodes, null, and null.
    queueTreeMutationRecord(node, new OrderedSet(), nodes, null, null);
  }

  // 5. If child is non-null, then:
  if (child) {
    // 1. For each live range whose start node is parent and start offset is greater than child’s index, increase its start offset by count.
    // 2. For each live range whose end node is parent and end offset is greater than child’s index, increase its end offset by count.
  }

  // 6. Let previousSibling be child’s previous sibling or parent’s last child if child is null.
  const previousSibling = child
    ? getPreviousSibling(child)
    : getLastChild(parent);

  // 7. For each node in nodes, in tree order:
  for (const node of nodes) { // The iteration order of nodes is tree order
    // 1. Adopt node into parent’s node document.
    adoptNode(node, parent[$nodeDocument]);

    // 2. If child is null, then append node to parent’s children.
    if (child === null) parent._children.append(node as Child);
    // 3. Otherwise, insert node into parent’s children before child’s index.
    else parent._children.insert(getIndex(child), node as Child);
    // sync parent
    node._parent = parent as Parent;

    // 4. If parent is a shadow host whose shadow root’s slot assignment is "named" and node is a slottable, then assign a slot for node.
    if (
      isElement(parent) &&
      isShadowHost(parent) &&
      parent[$shadowRoot][$slotAssignment] === "named" &&
      isSlottable(node)
    ) assignSlot(node);

    // 5. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.
    // TODO
    if (isShadowRoot(getRoot(parent))) signalSlotChange(parent as any);

    // 6. Run assign slottables for a tree with node’s root.
    // assignSlottablesForTree(getRoot(node));

    // 7. For each shadow-including inclusive descendant inclusiveDescendant of node, in shadow-including tree order:
    //// 1. Run the insertion steps with inclusiveDescendant.
    //// 2. If inclusiveDescendant is connected, then:
    ///// 1. If inclusiveDescendant is custom, then enqueue a custom element callback reaction with inclusiveDescendant, callback name "connectedCallback", and an empty argument list.

    ///// 2. Otherwise, try to upgrade inclusiveDescendant.
  }

  // 8. If suppress observers flag is unset, then queue a tree mutation record for parent with nodes, « », previousSibling, and child.
  if (suppressObservers === null) {
    queueTreeMutationRecord(
      parent,
      nodes,
      new OrderedSet(),
      previousSibling,
      child,
    );
  }

  // 9. Run the children changed steps for parent.
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @throws {DOMException}
 */
export function ensurePreInsertionValidity(
  node: Node,
  parent: Node,
  child: Child | null,
): void {
  // 1. If parent is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
  if (
    !(isDocument(parent) || isDocumentFragment(parent) || isElement(parent))
  ) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  // 2. If node is a host-including inclusive ancestor of parent, then throw a "HierarchyRequestError" DOMException.
  if (isHostIncludingInclusiveAncestorOf(node, parent)) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  // 3. If child is non-null and its parent is not parent, then throw a "NotFoundError" DOMException.
  if (child !== null && child._parent !== parent) {
    throw new DOMException("<message>", DOMExceptionName.NotFoundError);
  }

  // 4. If node is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
  if (
    !(isDocumentFragment(node) || isDocumentType(node) || isElement(node) ||
      isCharacterData(node))
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is not a document, then throw a "HierarchyRequestError" DOMException.
  if (
    (isText(node) && isDocument(parent)) ||
    (isDocumentType(node) && !isDocument(parent))
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 6. If parent is a document, and any of the statements below, switched on the interface node implements, are true, then throw a "HierarchyRequestError" DOMException.
  if (isDocument(parent)) {
    // DocumentFragment
    if (isDocumentFragment(node)) {
      const elementsCount = filter(node._children, isElement).length;

      // If node has more than one element child or has a Text node child.
      if (elementsCount > 1 || some(node._children, isText)) {
        throw new DOMException(
          "<message>",
          DOMExceptionName.HierarchyRequestError,
        );
      }

      // Otherwise, if node has one element child and either parent has an element child, child is a doctype, or child is non-null and a doctype is following child.
      if (
        elementsCount === 1 && (
          some(parent._children, isElement) ||
          (child && isDocumentType(child)) ||
          (child && some(getFollows(child), isDocumentType))
        )
      ) {
        throw new DOMException(
          "<message>",
          DOMExceptionName.HierarchyRequestError,
        );
      }
      // Element
    } else if (isElement(node)) {
      // parent has an element child, child is a doctype, or child is non-null and a doctype is following child.
      if (
        some(parent._children, isElement) ||
        (child && isDocumentType(child)) ||
        (child && some(getFollows(child), isDocumentType))
      ) {
        throw new DOMException(
          "<message>",
          DOMExceptionName.HierarchyRequestError,
        );
      }
    } // DocumentType
    else if (isDocumentType(node)) {
      // parent has a doctype child, child is non-null and an element is preceding child, or child is null and parent has an element child.
      if (
        some(parent._children, isDocumentType) ||
        (child && some(getPrecedings(child), isElement)) ||
        (!child && some(parent._children, isElement))
      ) {
        throw new DOMException(
          "<message>",
          DOMExceptionName.HierarchyRequestError,
        );
      }
    }
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-pre-insert
 */
export function preInsertNode(
  node: Node,
  parent: Node,
  child: Child | null,
): Node {
  // 1. Ensure pre-insertion validity of node into parent before child.
  ensurePreInsertionValidity(node, parent, child);

  // 2. Let referenceChild be child.
  let referenceChild = child;

  // 3. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) referenceChild = getNextSibling(node);

  // 4. Insert node into parent before referenceChild.
  insertNode(node, parent, referenceChild);

  // 5. Return node.
  return node;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-replace-all
 */
export function replaceAllNode(
  node: Node | null,
  parent: Node,
): void {
  // 1. Let removedNodes be parent’s children.
  const removeNodes = parent._children;

  // 2. Let addedNodes be the empty set.
  const addNodes = !node
    ? new OrderedSet<Node>()
    // 3. If node is a DocumentFragment node, then set addedNodes to node’s children.
    : isDocumentFragment(node)
    ? node._children.clone()
    // 4. Otherwise, if node is non-null, set addedNodes to « node ».
    : new OrderedSet([node]);

  // 5. Remove all parent’s children, in tree order, with the suppress observers flag set.
  // removeNode delete parent's children, so not lazy.
  for (const node of [...parent._children]) removeNode(node, true);

  // 6. If node is non-null, then insert node into parent before null with the suppress observers flag set.
  if (node) insertNode(node, parent, null, true);

  // 7. If either addedNodes or removedNodes is not empty, then queue a tree mutation record for parent with addedNodes, removedNodes, null, and null.
  if (!addNodes.isEmpty || !removeNodes.isEmpty) {
    queueTreeMutationRecord(parent, addNodes, removeNodes, null, null);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-pre-remove
 */
export function preRemoveChild<T extends Node>(child: T, parent: Node): T {
  // 1. If child’s parent is not parent, then throw a "NotFoundError" DOMException.
  if (child._parent !== parent) {
    throw new DOMException("<message>", DOMExceptionName.NotFoundError);
  }

  // 2. Remove child.
  removeNode(child);

  // 3. Return child.
  return child;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-remove
 */
export function removeNode(
  node: Node,
  suppressObservers: boolean | null = null,
) {
  // 1. Let parent be node’s parent.
  const parent = node._parent;
  // 2. Assert: parent is non-null.
  if (!parent) return;

  // 3. Let index be node’s index.
  const index = getIndex(node);

  // 4. For each live range whose start node is an inclusive descendant of node, set its start to (parent, index).

  // 5. For each live range whose end node is an inclusive descendant of node, set its end to (parent, index).

  // 6. For each live range whose start node is parent and start offset is greater than index, decrease its start offset by 1.

  // 7. For each live range whose end node is parent and end offset is greater than index, decrease its end offset by 1.

  // 8. For each NodeIterator object iterator whose root’s node document is node’s node document, run the NodeIterator pre-removing steps given node and iterator.

  // 9. Let oldPreviousSibling be node’s previous sibling.
  const oldPreviousSibling = getPreviousSibling(node);

  // 10. Let oldNextSibling be node’s next sibling.
  const oldNextSibling = getNextSibling(node);

  // 11. Remove node from its parent’s children.
  parent._children.remove((target) => target === node);
  // sync parent
  node._parent = null;

  // 12. If node is assigned, then run assign slottables for node’s assigned slot.

  // 13. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.

  // 14. If node has an inclusive descendant that is a slot, then:

  // 1. Run assign slottables for a tree with parent’s root.

  // 2. Run assign slottables for a tree with node.

  // 15. Run the removing steps with node and parent.

  // 16. Let isParentConnected be parent’s connected.

  // 17. If node is custom and isParentConnected is true, then enqueue a custom element callback reaction with node, callback name "disconnectedCallback", and an empty argument list.

  // 18. For each shadow-including descendant descendant of node, in shadow-including tree order, then:

  // 19. Run the removing steps with descendant and null.

  // 20. If descendant is custom and isParentConnected is true, then enqueue a custom element callback reaction with descendant, callback name "disconnectedCallback", and an empty argument list.

  // 21. For each inclusive ancestor inclusiveAncestor of parent, and then for each registered of inclusiveAncestor’s registered observer list, if registered’s options["subtree"] is true, then append a new transient registered observer whose observer is registered’s observer, options is registered’s options, and source is registered to node’s registered observer list.
  for (
    const inclusiveAncestor of getInclusiveAncestors(parent) as Iterable<Node>
  ) {
    const list = inclusiveAncestor["registeredObserverList"];
    for (const registered of [...list]) {
      if (registered.options.subtree) {
        list.append({
          observer: registered.observer,
          options: registered.options,
          source: registered,
        });
      }
    }
  }

  // 22. If suppress observers flag is unset, then queue a tree mutation record for parent with « », « node », oldPreviousSibling, and oldNextSibling.
  if (suppressObservers === null) {
    queueTreeMutationRecord(
      parent,
      new OrderedSet(),
      new OrderedSet([node]),
      oldPreviousSibling,
      oldNextSibling,
    );
  }

  // 23. Run the children changed steps for parent.
}

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
  if (hasParent(node)) removeNode(node);

  // 3. If document is not oldDocument, then:
  if (document !== oldDocument) {
    // 1. For each inclusiveDescendant in node’s shadow-including inclusive descendants:
    for (
      const inclusiveDescendant of getInclusiveDescendants(node) as Iterable<
        Node
      >
    ) { // TODO(miyauci): shadow-including
      // 1. Set inclusiveDescendant’s node document to document.
      inclusiveDescendant[$nodeDocument] = document;

      // 2. If inclusiveDescendant is an element, then set the node document of each attribute in inclusiveDescendant’s attribute list to document.
    }
  }

  // 2. For each inclusiveDescendant in node’s shadow-including inclusive descendants that is custom, enqueue a custom element callback reaction with inclusiveDescendant, callback name "adoptedCallback", and an argument list containing oldDocument and document.

  // 3. For each inclusiveDescendant in node’s shadow-including inclusive descendants, in shadow-including tree order, run the adopting steps with inclusiveDescendant and oldDocument.
}
