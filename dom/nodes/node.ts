import { isAttr, isDocument, isText } from "./utils.ts";
import { NodeList, NodeListOf } from "./node_trees/node_list.ts";
import { isConnected, nodeLength } from "./node_trees/node_tree.ts";
import type { INode } from "../../interface.d.ts";
import {
  appendNode,
  compareRangeOffset,
  equalsNodeEndNode,
  equalsNodeStartNode,
  Operator,
  preInsertNode,
  preRemoveChild,
  removeNode,
  replaceChild,
} from "./node_trees/mutation.ts";
import { ifilter, iter } from "../../deps.ts";
import { concatString } from "../../infra/string.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { type Const, constant } from "../../webidl/idl.ts";
import { List } from "../../infra/data_structures/list.ts";
import { replaceData } from "./character_data_utils.ts";
import {
  type RegisteredObserver,
  type TransientRegisteredObserver,
} from "./mutation_observers/queue.ts";
import { Steps } from "../infra/applicable.ts";
import { EventTarget } from "../events/event_target.ts";
import { $, internalSlots, tree } from "../../internal.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import { Get } from "../../utils.ts";
import {
  equals,
  getInterface,
  getParentElement,
  locateNamespace,
  locateNamespacePrefix,
} from "./node_utils.ts";
import { documentBaseURL } from "../../html/infra/url.ts";
import { URLSerializer } from "../../url/serializer.ts";
import { isExclusiveTextNode } from "./text_utils.ts";

const inspect = Symbol.for("Deno.customInspect");

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  CDATA_SECTION_NODE,
  ENTITY_REFERENCE_NODE,
  ENTITY_NODE,
  PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  NOTATION_NODE,
}

enum Position {
  DOCUMENT_POSITION_DISCONNECTED = 1,
  DOCUMENT_POSITION_PRECEDING = 2,
  DOCUMENT_POSITION_FOLLOWING = 4,
  DOCUMENT_POSITION_CONTAINS = 8,
  DOCUMENT_POSITION_CONTAINED_BY = 16,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32,
}

export interface NodeStates {
  nodeDocument: Document;
}

@Exposed(Window)
export abstract class Node extends EventTarget implements INode {
  @constant
  static DOCUMENT_POSITION_DISCONNECTED =
    Position.DOCUMENT_POSITION_DISCONNECTED;

  @constant
  static DOCUMENT_POSITION_PRECEDING = Position.DOCUMENT_POSITION_PRECEDING;

  @constant
  static DOCUMENT_POSITION_FOLLOWING = Position.DOCUMENT_POSITION_FOLLOWING;

  @constant
  static DOCUMENT_POSITION_CONTAINS = Position.DOCUMENT_POSITION_CONTAINS;

  @constant
  static DOCUMENT_POSITION_CONTAINED_BY =
    Position.DOCUMENT_POSITION_CONTAINED_BY;

  @constant
  static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
    Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;

  @constant
  static ELEMENT_NODE = NodeType.ELEMENT_NODE;

  @constant
  static ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE;

  @constant
  static TEXT_NODE = NodeType.TEXT_NODE;

  @constant
  static CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE;

  @constant
  static ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE;

  @constant
  static ENTITY_NODE = NodeType.ENTITY_NODE;

  @constant
  static PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE;

  @constant
  static COMMENT_NODE = NodeType.COMMENT_NODE;

  @constant
  static DOCUMENT_NODE = NodeType.DOCUMENT_NODE;

  @constant
  static DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE;

  @constant
  static DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE;

  @constant
  static NOTATION_NODE = NodeType.NOTATION_NODE;

  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

  constructor(nodeDocument: Document) {
    super();

    internalSlots.extends<Node>(this, new NodeInternals(nodeDocument));
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-node-baseuri)
   */
  get baseURI(): string {
    const url = documentBaseURL(this.#_.nodeDocument);
    // return this’s node document’s document base URL, serialized.
    return URLSerializer.serialize(url);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isconnected
   */
  get isConnected(): boolean {
    // return true, if this is connected; otherwise false.
    return isConnected(this);
  }

  abstract get ownerDocument(): Document | null;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
   */
  getRootNode(options: GetRootNodeOptions = {}): globalThis.Node {
    // return this’s shadow-including root if options["composed"] is true; otherwise this’s root.
    return options.composed ? tree.shadowIncludingRoot(this) : tree.root(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-parentnode
   */
  get parentNode(): ParentNode | null {
    // return this’s parent.
    return tree.parent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-haschildnodes
   */
  hasChildNodes(): boolean {
    // return true if this has children; otherwise false
    return !tree.children(this).isEmpty;
  }

  @SameObject
  get childNodes(): NodeListOf<ChildNode> {
    return new NodeList({
      root: this,
      filter: (node, root): boolean => {
        return (tree.children(root) as OrderedSet<globalThis.Node>).contains(
          node,
        );
      },
    }) as NodeListOf<ChildNode>;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-firstchild
   */
  get firstChild(): ChildNode | null {
    // return this’s first child.
    return tree.firstChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lastchild
   */
  get lastChild(): (ChildNode) | null {
    // return this’s last child.
    return tree.lastChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-previoussibling
   */
  get previousSibling(): ChildNode | null {
    // return this’s previous sibling.
    return tree.previousSibling(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nextsibling
   */
  get nextSibling(): ChildNode | null {
    // return this’s next sibling.
    return tree.nextSibling(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-normalize
   */
  normalize(): void {
    const descendants = tree.descendants(this);
    const descendantExclusiveTextNodes = ifilter(descendants, isText);

    for (const node of [...descendantExclusiveTextNodes]) { // remove will occurs, use spread.
      // 1. Let length be node’s length.
      let length = nodeLength(node);

      // 2. If length is zero, then remove node and continue with the next exclusive Text node, if any.
      if (!length) {
        removeNode(node);
        continue;
      }

      const contiguousExclusiveTextNodes = [
        ...tree.contiguousExclusiveTextNodes(node),
      ];
      const contiguousExclusiveTextNodesExcludingNode =
        contiguousExclusiveTextNodes.filter((v) => v !== node);
      const dataList = contiguousExclusiveTextNodesExcludingNode.map((v) =>
        $(v)
      ).map(
        Get.data,
      );

      // 3. Let data be the concatenation of the data of node’s contiguous exclusive Text nodes (excluding itself), in tree order.
      const data = concatString(new List(dataList));

      // 4. Replace data with node node, offset length, count 0, and data data.
      replaceData(node, length, 0, data);

      // 5. Let currentNode be node’s next sibling.
      let currentNode = tree.nextSibling(node);

      const { nodeDocument } = $(node);
      const { ranges: _ranges } = $(nodeDocument);
      const ranges = iter(_ranges);
      // 6. While currentNode is an exclusinve Text node:
      while (
        currentNode && isText(currentNode) && isExclusiveTextNode(currentNode)
      ) {
        const startNodeIsCurrentNode = equalsNodeStartNode.bind(
          null,
          currentNode,
        );
        // 1. For each live range whose start node is currentNode,
        for (
          const range of ranges.filter(startNodeIsCurrentNode)
          // add length to its start offset and set its start node to node.
        ) length += $(range).startOffset, $(range).start[0] = node;

        const endNodeIsCurrentNode = equalsNodeEndNode.bind(
          null,
          currentNode,
        );
        // 2. For each live range whose end node is currentNode,
        for (const range of ranges.filter(endNodeIsCurrentNode)) {
          // add length to its end offset and set its end node to node.
          length += $(range).endOffset, $(range).end[0] = node;
        }

        const parent = tree.parent(currentNode);

        if (parent) {
          const startNodeIsCurrentParent = equalsNodeStartNode.bind(
            null,
            parent,
          );
          const currentNodeIndex = tree.index(currentNode);
          const startOffsetIsCurrentNodeIndex = compareRangeOffset.bind(
            null,
            Operator.Eq,
            currentNodeIndex,
            true,
          );

          // 3. For each live range whose start node is currentNode’s parent and start offset is currentNode’s index,
          for (
            const range of ranges.filter(startNodeIsCurrentParent).filter(
              startOffsetIsCurrentNodeIndex,
            )
            // set its start node to node and its start offset to length.
          ) $(range).start[0] = node, $(range).start[1] = length;

          const endNodeIsCurrentParent = equalsNodeEndNode.bind(
            null,
            parent,
          );
          const endOffsetIsCurrentNodeIndex = compareRangeOffset.bind(
            null,
            Operator.Eq,
            currentNodeIndex,
            false,
          );

          // 4. For each live range whose end node is currentNode’s parent and end offset is currentNode’s index,
          for (
            const range of ranges.filter(endNodeIsCurrentParent).filter(
              endOffsetIsCurrentNodeIndex,
            )
            // set its end node to node and its end offset to length.
          ) $(range).end[0] = node, $(range).end[1] = length;
        }

        // 5. Add currentNode’s length to length.
        length += nodeLength(currentNode);

        // 6. Set currentNode to its next sibling.
        currentNode = tree.nextSibling(currentNode);
      }

      // 7. Remove node’s contiguous exclusive Text nodes (excluding itself), in tree order.
      contiguousExclusiveTextNodesExcludingNode.forEach((node) =>
        removeNode(node)
      );
    }
  }

  cloneNode(deep?: boolean | undefined): globalThis.Node {
    let document = this.#_.nodeDocument;
    const copy = this.clone(document);

    if (isDocument(copy)) document = copy;

    if (deep) {
      for (const child of tree.children(this)) {
        appendNode(Node.prototype.cloneNode.call(child, deep), copy);
      }
    }

    return copy;
  }

  /** Clone instance.
   * This API is used by {@linkcode cloneNode}.
   * It is not public API, so should be mark private.
   */
  protected abstract clone(document: Document): globalThis.Node;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isequalnode
   */
  isEqualNode(otherNode: globalThis.Node | null): boolean {
    // return true if otherNode is non-null and this equals otherNode; otherwise false.
    return !!otherNode && equals(this, otherNode);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-issamenode
   */
  isSameNode(otherNode: globalThis.Node | null): boolean {
    // return true if otherNode is this; otherwise false.
    return this === otherNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
   */
  compareDocumentPosition(other: globalThis.Node): number {
    // 1. If this is other, then return zero.
    if (this === other) return 0;

    // 2. Let node1 be other and node2 be this.
    let node1: globalThis.Node | null = other;
    // deno-lint-ignore no-this-alias
    let node2: globalThis.Node | Element | null = this;
    let attr1: Attr | null = null;
    let attr2: Attr | null = null;

    // 4. node1 is an attribute, then set attr1 to node1 and node1 to attr1’s element.
    if (isAttr(node1)) attr1 = node1, node1 = $(attr1).element;

    // 5. If node2 is an attribute, then:
    if (isAttr(node2)) {
      // 1. Set attr2 to node2 and node2 to attr2’s element.
      attr2 = node2, node2 = $(attr2).element;

      // 2. If attr1 and node1 are non-null, and node2 is node1, then:
      if (!!attr1 && !!node1 && node2 === node1) {
        // 2. For each attr in node2’s attribute list:
        for (const attr of $(node2 as Element).attributeList) {
          // 1. If attr equals attr1, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_PRECEDING.
          if (equals(attr, attr1)) {
            return Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC +
              Position.DOCUMENT_POSITION_PRECEDING;
          }

          // 2. If attr equals attr2, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_FOLLOWING.
          if (equals(attr, attr2)) {
            return Position.DOCUMENT_POSITION_PRECEDING +
              Position.DOCUMENT_POSITION_FOLLOWING;
          }
        }
      }
    }
    // 6. If node1 or node2 is null, or node1’s root is not node2’s root, then return the result of adding DOCUMENT_POSITION_DISCONNECTED, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING, with the constraint that this is to be consistent, together.
    if (!node1 || !node2 || tree.root(node1) !== tree.root(node2)) {
      return Position.DOCUMENT_POSITION_DISCONNECTED +
        Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC +
        Position.DOCUMENT_POSITION_PRECEDING;
    }

    // 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2 and attr2 is non-null, then return the result of adding DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
    if (
      (tree.isAncestor(node1, node2) && !attr1) || (node1 === node2 && !attr2)
    ) {
      return Position.DOCUMENT_POSITION_CONTAINS +
        Position.DOCUMENT_POSITION_PRECEDING;
    }

    // 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2 and attr1 is non-null, then return the result of adding DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
    if (
      (tree.isDescendant(node1, node2) && !attr2) ||
      (node1 === node2 && attr1)
    ) {
      return Position.DOCUMENT_POSITION_CONTAINED_BY +
        Position.DOCUMENT_POSITION_FOLLOWING;
    }

    // 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
    if (tree.isPreceding(node1, node2)) {
      return Position.DOCUMENT_POSITION_PRECEDING;
    }

    // 10. Return DOCUMENT_POSITION_FOLLOWING.
    return Position.DOCUMENT_POSITION_FOLLOWING;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-contains
   */
  contains(other: globalThis.Node | null): boolean {
    if (!other) return false;

    // return true if other is an inclusive descendant of this; otherwise false (including when other is null).
    return tree.isInclusiveDescendant(other, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
   */
  lookupPrefix(namespace: string | null): string | null {
    // 1. If namespace is null or the empty string, then return null.
    if (!namespace) return null;

    // 2. Switch on the interface this implements:
    const element = getInterface(this, this.nodeType);

    if (element) return locateNamespacePrefix(element, namespace);

    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
   */
  lookupNamespaceURI(prefix: string | null): string | null {
    // 1. If prefix is the empty string, then set it to null.
    prefix ||= null;

    // 2. Return the result of running locate a namespace for this using prefix.
    return locateNamespace(this, prefix);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
   */
  isDefaultNamespace(namespace: string | null): boolean {
    // 1. If namespace is the empty string, then set it to null.
    namespace ||= null;

    // 2. Let defaultNamespace be the result of running locate a namespace for this using null.
    const defaultNamespace = locateNamespace(this, null);

    // 3. Return true if defaultNamespace is the same as namespace; otherwise false.
    return defaultNamespace === namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-insertbefore
   */
  insertBefore<T extends globalThis.Node>(node: T, child: ChildNode | null): T {
    // return the result of pre-inserting node into this before child.
    return preInsertNode(node, this, child);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-node-appendchild)
   */
  appendChild<T extends globalThis.Node>(node: T): T {
    // return the result of appending node to this.
    return appendNode(node, this);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-node-replacechild)
   */
  replaceChild<T extends globalThis.Node>(node: Node, child: T): T {
    // return the result of replacing child with node within this.
    return replaceChild(child, node, this);
  }

  removeChild<T extends globalThis.Node>(child: T): T {
    return preRemoveChild(child, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-parentelement
   */
  get parentElement(): HTMLElement | null {
    return getParentElement(this) as HTMLElement | null; // The specification is `Element`
  }

  [inspect](): string {
    return `${this.nodeName}
  ${[...tree.children(this)].map((node) => this[inspect].call(node)).join("")}`;
  }

  get #_() {
    return $<Node>(this);
  }
}

export interface Node
  extends
    Const<"CDATA_SECTION_NODE", NodeType.CDATA_SECTION_NODE>,
    Const<"DOCUMENT_FRAGMENT_NODE", NodeType.DOCUMENT_FRAGMENT_NODE>,
    Const<"DOCUMENT_TYPE_NODE", NodeType.DOCUMENT_TYPE_NODE>,
    Const<"DOCUMENT_NODE", NodeType.DOCUMENT_NODE>,
    Const<"ELEMENT_NODE", NodeType.ELEMENT_NODE>,
    Const<"ENTITY_NODE", NodeType.ENTITY_NODE>,
    Const<"ATTRIBUTE_NODE", NodeType.ATTRIBUTE_NODE>,
    Const<"TEXT_NODE", NodeType.TEXT_NODE>,
    Const<"ENTITY_REFERENCE_NODE", NodeType.ENTITY_REFERENCE_NODE>,
    Const<"COMMENT_NODE", NodeType.COMMENT_NODE>,
    Const<"PROCESSING_INSTRUCTION_NODE", NodeType.PROCESSING_INSTRUCTION_NODE>,
    Const<"NOTATION_NODE", NodeType.NOTATION_NODE>,
    Const<
      "DOCUMENT_POSITION_DISCONNECTED",
      Position.DOCUMENT_POSITION_DISCONNECTED
    >,
    Const<"DOCUMENT_POSITION_PRECEDING", Position.DOCUMENT_POSITION_PRECEDING>,
    Const<"DOCUMENT_POSITION_FOLLOWING", Position.DOCUMENT_POSITION_FOLLOWING>,
    Const<"DOCUMENT_POSITION_CONTAINS", Position.DOCUMENT_POSITION_CONTAINS>,
    Const<
      "DOCUMENT_POSITION_CONTAINED_BY",
      Position.DOCUMENT_POSITION_CONTAINED_BY
    >,
    Const<
      "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",
      Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
    > {}

export class NodeInternals {
  nodeDocument: Document;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-insert-ext)
   */
  insertionSteps: Steps<[insertedNode: globalThis.Node]> = new Steps();

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-adopt-ext)
   */
  adoptingSteps: Steps<[node: globalThis.Node, oldDocument: Document]> =
    new Steps();

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-children-changed-ext)
   */
  childrenChangedSteps: Steps<[]> = new Steps();

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-remove-ext)
   */
  removingSteps: Steps<
    [removedNode: globalThis.Node, oldParent: globalThis.Node | null]
  > = new Steps();

  /** @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer-list) */
  registeredObserverList: List<
    RegisteredObserver | TransientRegisteredObserver
  > = new List();

  constructor(nodeDocument: Document) {
    this.nodeDocument = nodeDocument;
  }
}
