import {
  isCharacterData,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isShadowHost,
  isShadowRoot,
  isText,
} from "./utils/type.ts";
import { OrderedSet } from "../_internals/infra/data_structures/set.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { isHostIncludingInclusiveAncestorOf } from "./document_fragment_algorithm.ts";
import { filter, find, iter, some } from "../deps.ts";
import {
  assignSlot,
  assignSlottables,
  assignSlottablesForTree,
  isConnected,
  isSlot,
  isSlottable,
  signalSlotChange,
} from "./node_tree.ts";
import { queueTreeMutationRecord } from "./queue.ts";
import { $, tree } from "../internal.ts";
import { isCustom } from "./utils/element.ts";
import { enqueueCustomElementCallbackReaction } from "../_internals/html/elements/custom_elements/custom_element_reaction.ts";
import { isAssigned } from "./utils/slottable.ts";
import { tryUpgradeElement } from "../_internals/html/elements/custom_elements/upgrade.ts";
import { adoptNode } from "./utils/document.ts";

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
  if (tree.parent(child) !== parent) {
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
      case node.DOCUMENT_FRAGMENT_NODE: {
        // If node has more than one element child or has a Text node child.
        const elementsCount = filter(tree.children(node), isElement).length;

        if (elementsCount > 1 || find(tree.children(node), isText)) return true;

        // Otherwise, if node has one element child and either parent has an element child that is not child or a doctype is following child.
        if (
          elementsCount === 1 && (
            some(
              filter(tree.children(parent), isElement),
              (value) => !Object.is(value, child),
            ) ||
            some(tree.follows(child), isDocumentType)
          )
        ) return true;

        return false;
      }

      case node.ELEMENT_NODE: {
        // parent has an element child that is not child or a doctype is following child.
        const element = find(tree.children(parent), isElement);

        return (element && !Object.is(element, child)) ||
          some(tree.follows(child), isDocumentType);
      }

      case node.DOCUMENT_TYPE_NODE: {
        // parent has a doctype child that is not child, or an element is preceding child.
        const doctype = find(tree.children(parent), isDocumentType);

        return ((doctype && !Object.is(doctype, child)) ||
          some(tree.precedes(child), isElement));
      }

      default:
        return false;
    }
  }

  // 7. Let referenceChild be child’s next sibling.
  let referenceChild = tree.nextSibling(child);

  // 8. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) referenceChild = tree.nextSibling(node);

  // 9. Let previousSibling be child’s previous sibling.
  const previousSibling = tree.previousSibling(child);

  // 10. Let removedNodes be the empty set.
  let removedNodes = new OrderedSet<Node>();

  // 11. If child’s parent is non-null, then:
  if (tree.parent(child)) {
    // 1. Set removedNodes to « child ».
    removedNodes = new OrderedSet([child]);

    // 2. Remove child with the suppress observers flag set.
    removeNode(child, true);
  }

  // 12. Let nodes be node’s children if node is a DocumentFragment node; otherwise « node ».
  const nodes = isDocumentFragment(node)
    ? new OrderedSet(tree.children(node))
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
  child: Node | null,
  suppressObservers: boolean | null = null,
): void {
  const nodeIsDocumentFragment = isDocumentFragment(node);
  // 1. Let nodes be node’s children, if node is a DocumentFragment node; otherwise « node ».
  const nodes = nodeIsDocumentFragment
    ? new OrderedSet(tree.children(node))
    : new OrderedSet<Node>([node]);

  // 2. Let count be nodes’s size.
  const count = nodes.size;

  // 3. If count is 0, then return.
  if (!count) return;

  // 4. If node is a DocumentFragment node, then:
  if (nodeIsDocumentFragment) {
    // 1. Remove its children with the suppress observers flag set.
    for (const child of [...tree.children(node)]) removeNode(child, true);

    // 2. Queue a tree mutation record for node with « », nodes, null, and null.
    queueTreeMutationRecord(node, new OrderedSet(), nodes, null, null);
  }

  // 5. If child is non-null, then:
  if (child) {
    const { nodeDocument } = $(node);
    const { ranges: _ranges } = $(nodeDocument);
    const ranges = iter(_ranges);
    const startNodeIsParent = equalsNodeStartNode.bind(null, parent);
    const childIndex = tree.index(child);
    const startOffsetIsGtChildIndex = compareRangeOffset.bind(
      null,
      Operator.Gt,
      childIndex,
      true,
    );

    // 1. For each live range whose start node is parent and start offset is greater than child’s index, increase its start offset by count.
    for (
      const range of ranges.filter(startNodeIsParent).filter(
        startOffsetIsGtChildIndex,
      )
    ) $(range).start[1] += count;

    const endNodeIsParent = equalsNodeEndNode.bind(null, parent);
    const endOffsetIsGtChildIndex = compareRangeOffset.bind(
      null,
      Operator.Gt,
      childIndex,
      false,
    );

    // 2. For each live range whose end node is parent and end offset is greater than child’s index, increase its end offset by count.
    for (
      const range of ranges.filter(endNodeIsParent).filter(
        endOffsetIsGtChildIndex,
      )
    ) $(range).end[1] += count;
  }

  // 6. Let previousSibling be child’s previous sibling or parent’s last child if child is null.
  const previousSibling = child
    ? tree.previousSibling(child)
    : tree.lastChild(parent);

  // 7. For each node in nodes, in tree order:
  for (const node of nodes) {
    // 1. Adopt node into parent’s node document.
    adoptNode(node, $(parent).nodeDocument);

    // 2. If child is null, then append node to parent’s children.
    if (child === null) tree.children(parent).append(node as ChildNode);
    // 3. Otherwise, insert node into parent’s children before child’s index.
    else tree.children(parent).insert(tree.index(child), node as ChildNode);

    // 4. If parent is a shadow host whose shadow root’s slot assignment is "named" and node is a slottable, then assign a slot for node.
    if (
      isElement(parent) &&
      isShadowHost(parent) &&
      // TODO
      $(parent).shadowRoot &&
      $($(parent).shadowRoot!).slotAssignment === "named" &&
      isSlottable(node)
    ) assignSlot(node);

    // 5. If parent’s root is a shadow root,
    if (
      isShadowRoot(tree.root(parent)) &&
      // and parent is a slot whose assigned nodes is the empty list,
      isElement(parent) && isSlot(parent) && $(parent).assignedNodes.isEmpty
      // then run signal a slot change for parent.
    ) signalSlotChange(parent);

    // 6. Run assign slottables for a tree with node’s root.
    assignSlottablesForTree(tree.root(node));

    // 7. For each shadow-including inclusive descendant inclusiveDescendant of node, in shadow-including tree order:
    for (
      const inclusiveDescendant of tree.shadowIncludingInclusiveDescendants(
        node,
      )
    ) {
      // 1. Run the insertion steps with inclusiveDescendant.
      $(node).insertionSteps.run(inclusiveDescendant);

      // 2. If inclusiveDescendant is connected, then:
      if (isConnected(inclusiveDescendant)) {
        // 1. If inclusiveDescendant is custom,
        if (isCustom(inclusiveDescendant)) {
          // then enqueue a custom element callback reaction with inclusiveDescendant, callback name "connectedCallback", and an empty argument list.
          enqueueCustomElementCallbackReaction(
            inclusiveDescendant,
            "connectedCallback",
            [],
          );
          // 2. Otherwise, try to upgrade inclusiveDescendant.
        } else tryUpgradeElement(inclusiveDescendant);
      }
    }
  }

  // 8. If suppress observers flag is unset, then queue a tree mutation record for parent with nodes, « », previousSibling, and child.
  if (!suppressObservers) {
    queueTreeMutationRecord(
      parent,
      nodes,
      new OrderedSet(),
      previousSibling,
      child,
    );
  }

  // 9. Run the children changed steps for parent.
  $(parent).childrenChangedSteps.run();
}

export function equalsNodeEndNode(node: Node, range: Range): boolean {
  return $(range).startNode === node;
}

export function equalsNodeStartNode(node: Node, range: Range): boolean {
  return $(range).startNode === node;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 * @throws {DOMException}
 */
export function ensurePreInsertionValidity(
  node: Node,
  parent: Node,
  child: Node | null,
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
  if (child !== null && tree.parent(child) !== parent) {
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
      const elementsCount = filter(tree.children(node), isElement).length;

      // If node has more than one element child or has a Text node child.
      if (elementsCount > 1 || some(tree.children(node), isText)) {
        throw new DOMException(
          "<message>",
          DOMExceptionName.HierarchyRequestError,
        );
      }

      // Otherwise, if node has one element child and either parent has an element child, child is a doctype, or child is non-null and a doctype is following child.
      if (
        elementsCount === 1 && (
          some(tree.children(parent), isElement) ||
          (child && isDocumentType(child)) ||
          (child && some(tree.follows(child), isDocumentType))
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
        some(tree.children(parent), isElement) ||
        (child && isDocumentType(child)) ||
        (child && some(tree.follows(child), isDocumentType))
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
        some(tree.children(parent), isDocumentType) ||
        (child && some(tree.precedes(child), isElement)) ||
        (!child && some(tree.children(parent), isElement))
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
export function preInsertNode<T extends Node>(
  node: T,
  parent: Node,
  child: Node | null,
): T {
  // 1. Ensure pre-insertion validity of node into parent before child.
  ensurePreInsertionValidity(node, parent, child);

  // 2. Let referenceChild be child.
  let referenceChild = child;

  // 3. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) referenceChild = tree.nextSibling(node);

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
  const removeNodes = new OrderedSet(tree.children(parent)); // No lazy generation due to the possibility of being referenced in subsequent processing.

  // 2. Let addedNodes be the empty set.
  const addNodes = !node
    ? new OrderedSet<Node>()
    // 3. If node is a DocumentFragment node, then set addedNodes to node’s children.
    : isDocumentFragment(node)
    ? tree.children(node).clone()
    // 4. Otherwise, if node is non-null, set addedNodes to « node ».
    : new OrderedSet([node]);

  // 5. Remove all parent’s children, in tree order, with the suppress observers flag set.
  // removeNode delete parent's children, so not lazy.
  for (const node of [...tree.children(parent)]) removeNode(node, true);

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
  if (tree.parent(child) !== parent) {
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
): void {
  // 1. Let parent be node’s parent.
  const parent = tree.parent(node);
  // 2. Assert: parent is non-null.
  if (!parent) return;

  // 3. Let index be node’s index.
  const index = tree.index(node);

  const { nodeDocument } = $(node);
  const { iterators, ranges: _ranges } = $(nodeDocument);
  const ranges = iter(_ranges);

  // 4. For each live range whose start node is an inclusive descendant of node, set its start to (parent, index).
  for (const range of ranges.filter(isStartNodeInclusiveDescendantOfNode)) {
    $(range).start = [parent, index];
  }

  // 5. For each live range whose end node is an inclusive descendant of node, set its end to (parent, index).
  for (const range of ranges.filter(isEndNodeInclusiveDescendantOfNode)) {
    $(range).end = [parent, index];
  }

  const isStartNodeParent = equalsNodeStartNode.bind(null, parent);
  const startOffsetIsGtIndex = compareRangeOffset.bind(
    null,
    Operator.Gt,
    index,
    true,
  );

  // 6. For each live range whose start node is parent and start offset is greater than index, decrease its start offset by 1.
  for (
    const range of ranges.filter(isStartNodeParent).filter(startOffsetIsGtIndex)
  ) $(range).start[1]--;

  const endOffsetIsGtIndex = compareRangeOffset.bind(
    null,
    Operator.Gt,
    index,
    false,
  );
  const isEndNodeParent = equalsNodeEndNode.bind(null, parent);

  // 7. For each live range whose end node is parent and end offset is greater than index, decrease its end offset by 1.
  for (
    const range of ranges.filter(isEndNodeParent).filter(endOffsetIsGtIndex)
  ) $(range).end[1]--;

  function rootNodeDocumentIsNodeNodeDocument(iterator: NodeIterator): boolean {
    const { root } = $(iterator);

    return $(root).nodeDocument === nodeDocument;
  }

  // 8. For each NodeIterator object iterator whose root’s node document is node’s node document,
  for (
    const iterator of iter(iterators).filter(rootNodeDocumentIsNodeNodeDocument)
    // run the NodeIterator pre-removing steps given node and iterator.
  ) $(iterator).preRemovingSteps.run(iterator, node);

  // 9. Let oldPreviousSibling be node’s previous sibling.
  const oldPreviousSibling = tree.previousSibling(node);

  // 10. Let oldNextSibling be node’s next sibling.
  const oldNextSibling = tree.nextSibling(node);

  // 11. Remove node from its parent’s children.
  tree.children(parent).remove((child) => child === node);

  // 12. If node is assigned,
  if (isSlottable(node) && isAssigned(node)) {
    // then run assign slottables for node’s assigned slot.
    const { assignedSlot } = $(node);
    assignSlottables(assignedSlot!);
  }

  const root = tree.root(parent);
  // 13. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the empty list,
  if (isShadowRoot(root) && isElement(parent) && isSlot(parent)) {
    // then run signal a slot change for parent.
    signalSlotChange(parent);
  }

  const inclusiveDescendants = tree.inclusiveDescendants(node);
  // 14. If node has an inclusive descendant that is a slot, then:
  if (iter(inclusiveDescendants).filter(isElement).some(isSlot)) {
    // 1. Run assign slottables for a tree with parent’s root.
    assignSlottablesForTree(tree.root(parent));

    // 2. Run assign slottables for a tree with node.
    assignSlottablesForTree(node);
  }

  // 15. Run the removing steps with node and parent.
  $(node).removingSteps.run(node, parent);

  // 16. Let isParentConnected be parent’s connected.
  const isParentConnected = isConnected(parent);

  // 17. If node is custom and isParentConnected is true,
  if (isElement(node) && isCustom(node) && isParentConnected) {
    // then enqueue a custom element callback reaction with node, callback name "disconnectedCallback", and an empty argument list.
    enqueueCustomElementCallbackReaction(node, "disconnectedCallback", []);
  }

  // 18. For each shadow-including descendant descendant of node, in shadow-including tree order, then:
  for (const descendant of tree.shadowIncludingDescendants(node)) {
    // 1. Run the removing steps with descendant and null.
    $(node).removingSteps.run(descendant, null);

    // 2. If descendant is custom and isParentConnected is true,
    if (isElement(descendant) && isCustom(descendant) && isParentConnected) {
      // then enqueue a custom element callback reaction with descendant, callback name "disconnectedCallback", and an empty argument list.
      enqueueCustomElementCallbackReaction(
        descendant,
        "disconnectedCallback",
        [],
      );
    }
  }

  // 19. For each inclusive ancestor inclusiveAncestor of parent,
  for (const inclusiveAncestor of tree.inclusiveAncestors(parent)) {
    const { registeredObserverList } = $(inclusiveAncestor);
    // and then for each registered of inclusiveAncestor’s registered observer list,
    for (const registered of [...registeredObserverList]) {
      // if registered’s options["subtree"] is true,
      if (registered.options.subtree) {
        // then append a new transient registered observer whose observer is registered’s observer,
        registeredObserverList.append({
          observer: registered.observer,
          // options is registered’s options,
          options: registered.options,
          // and source is registered to node’s registered observer list.
          source: registered,
        });
      }
    }
  }

  // 20. If suppress observers flag is unset,
  if (!suppressObservers) {
    // then queue a tree mutation record for parent with « », « node », oldPreviousSibling, and oldNextSibling.
    queueTreeMutationRecord(
      parent,
      new OrderedSet(),
      new OrderedSet([node]),
      oldPreviousSibling,
      oldNextSibling,
    );
  }

  // 21. Run the children changed steps for parent.
  $(parent).childrenChangedSteps.run();

  function isStartNodeInclusiveDescendantOfNode(range: Range): boolean {
    const { startNode } = $(range);

    return tree.isInclusiveDescendant(startNode, node);
  }

  function isEndNodeInclusiveDescendantOfNode(range: Range): boolean {
    const { endNode } = $(range);

    return tree.isInclusiveDescendant(endNode, node);
  }
}

/** To append a node to a parent, pre-insert node into parent before null.
 * @see https://dom.spec.whatwg.org/#concept-node-append
 */
export function appendNode<T extends Node>(node: T, parent: Node): T {
  // To append a node to a parent, pre-insert node into parent before null.
  return preInsertNode(node, parent, null);
}

export enum Operator {
  Eq,
  Gt,
  Lte,
}

export function compareRangeOffset(
  operator: Operator,
  offset: number,
  isStart: boolean,
  range: Range,
): boolean {
  const _ = $(range);
  const rangeOffset = isStart ? _.startOffset : _.endOffset;

  switch (operator) {
    case Operator.Eq:
      return rangeOffset === offset;
    case Operator.Gt:
      return rangeOffset > offset;
    case Operator.Lte:
      return rangeOffset <= offset;
  }
}
