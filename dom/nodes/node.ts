import {
  getQualifiedName,
  isAttr,
  isDocument,
  isElement,
  isText,
  UnImplemented,
} from "./utils.ts";
import type { ChildNode } from "./node_trees/child_node.ts";
import type { CharacterData } from "./character_data.ts";
import type { ProcessingInstruction } from "./processing_instruction.ts";
import { NodeList, NodeListOf } from "./node_trees/node_list.ts";
import {
  getDocumentElement,
  isConnected,
  nodeLength,
} from "./node_trees/node_tree.ts";
import { type Document } from "./documents/document.ts";
import { type Text } from "./text.ts";
import type { INode } from "../../interface.d.ts";
import {
  appendNode,
  preInsertNode,
  preRemoveChild,
  removeNode,
  replaceChild,
} from "./mutation.ts";
import { HTMLCollection } from "./node_trees/html_collection.ts";
import {
  getDescendants,
  getFirstChild,
  getFollowingSiblings,
  getLastChild,
  getNextSibling,
  getPrecedingSiblings,
  getPreviousSibling,
  getRoot,
  isAncestorOf,
  isDescendantOf,
  isInclusiveDescendantOf,
  isPrecedeOf,
} from "../trees/tree.ts";
import { Namespace } from "../../infra/namespace.ts";
import {
  $attributeList,
  $data,
  $element,
  $localName,
  $mode,
  $name,
  $namespace,
  $namespacePrefix,
  $nodeDocument,
  $publicId,
  $systemId,
  $target,
  $value,
} from "./internal.ts";
import {
  every,
  find,
  html,
  ifilter,
  imap,
  izip,
  some,
  takewhile,
} from "../../deps.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import {
  concatString,
  matchASCIICaseInsensitive,
  toASCIILowerCase,
} from "../../infra/string.ts";
import { parseOrderSet } from "../trees/ordered_set.ts";
import type { ParentNode } from "./node_trees/parent_node.ts";
import { Exposed, SameObject } from "../../webidl/extended_attribute.ts";
import { type Const, constant } from "../../webidl/idl.ts";
import { type Attr } from "./elements/attr.ts";
import { type Element } from "./elements/element.ts";
import { type DocumentType } from "./document_type.ts";
import { List } from "../../infra/data_structures/list.ts";
import { replaceData } from "./character_data_algorithm.ts";
import {
  type RegisteredObserver,
  type TransientRegisteredObserver,
} from "./mutation_observers/queue.ts";
import { Child } from "./types.ts";

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

  abstract [$nodeDocument]: Document;

  abstract get nodeType(): NodeType;

  abstract get nodeName(): string;

  abstract get nodeValue(): string | null;

  abstract set nodeValue(value: string | null);

  abstract get textContent(): string | null;
  abstract set textContent(value: string | null);

  _parent: (Node & ParentNode) | null = null;
  _children: OrderedSet<Node & ChildNode> = new OrderedSet();

  /** @see https://dom.spec.whatwg.org/#registered-observer-list */
  private registeredObserverList: List<
    RegisteredObserver | TransientRegisteredObserver
  > = new List();

  get baseURI(): string {
    throw new UnImplemented("baseURI");
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
  getRootNode(options?: GetRootNodeOptions | undefined): Node {
    // return this’s shadow-including root if options["composed"] is true; otherwise this’s root.
    if (options?.composed) {
      throw new Error("getRootNode is not supported composed");
    }

    return getRoot(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-parentnode
   */
  get parentNode(): (Node & ParentNode) | null {
    // return this’s parent.
    return this._parent;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-haschildnodes
   */
  hasChildNodes(): boolean {
    // return true if this has children; otherwise fals
    return !this._children.isEmpty;
  }

  @SameObject
  get childNodes(): NodeListOf<Node & ChildNode> {
    return new NodeList({
      root: this,
      filter: (node, root): boolean => {
        return (root._children as OrderedSet<Node>).contains(node);
      },
    }) as any as NodeListOf<
      Node & ChildNode
    >;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-firstchild
   */
  get firstChild(): (Node & ChildNode) | null {
    // return this’s first child.
    return getFirstChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-lastchild
   */
  get lastChild(): (Node & ChildNode) | null {
    // return this’s last child.
    return getLastChild(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-previoussibling
   */
  get previousSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    return getPreviousSibling(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nextsibling
   */
  get nextSibling(): (Node & ChildNode) | null {
    // TODO(miyauci): O(1)
    return getNextSibling(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-normalize
   */
  normalize(): void {
    const descendants = getDescendants(this) as Iterable<Node>;
    const descendantExclusiveTextNodes = ifilter(descendants, isText);

    for (const node of [...descendantExclusiveTextNodes]) { // remove will occurs, use spread.
      // 1. Let length be node’s length.
      let length = nodeLength(node);

      // 2. If length is zero, then remove node and continue with the next exclusive Text node, if any.
      if (!length) {
        removeNode(node);
        continue;
      }

      const contiguousExclusiveTextNodes = contiguousTextNodesExclusive(node);
      const dataList = imap(
        contiguousExclusiveTextNodes,
        (text) => text[$data],
      );

      // 3. Let data be the concatenation of the data of node’s contiguous exclusive Text nodes (excluding itself), in tree order.
      const data = concatString(new List(dataList));

      // 4. Replace data with node node, offset length, count 0, and data data.
      replaceData(node, length, 0, data);

      // 5. Let currentNode be node’s next sibling.
      let currentNode = getNextSibling(node);

      // 6. While currentNode is an exclusive Text node:
      while (currentNode && isText(currentNode)) {
        // 1. For each live range whose start node is currentNode, add length to its start offset and set its start node to node.

        // 2. For each live range whose end node is currentNode, add length to its end offset and set its end node to node.

        // 3. For each live range whose start node is currentNode’s parent and start offset is currentNode’s index, set its start node to node and its start offset to length.

        // 4. For each live range whose end node is currentNode’s parent and end offset is currentNode’s index, set its end node to node and its end offset to length.

        // 5. Add currentNode’s length to length.
        length = nodeLength(currentNode);

        // 6. Set currentNode to its next sibling.
        currentNode = getNextSibling(currentNode);
      }

      // 7. Remove node’s contiguous exclusive Text nodes (excluding itself), in tree order.
      [...contiguousTextNodesExclusive(node)].forEach((node) =>
        removeNode(node)
      );
    }
  }

  cloneNode(deep?: boolean | undefined): Node {
    let document = this[$nodeDocument];
    const copy = this.clone(document);

    if (isDocument(copy)) document = copy;

    if (deep) {
      for (const child of this._children) {
        appendNode(Node.prototype.cloneNode.call(child, deep), copy);
      }
    }

    return copy;
  }

  /** Clone instance.
   * This API is used by {@linkcode cloneNode}.
   * It is not public API, so should be mark private.
   */
  protected abstract clone(document: Document): Node;

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-isequalnode
   */
  isEqualNode(otherNode: Node | null): boolean {
    // return true if otherNode is non-null and this equals otherNode; otherwise false.
    return !!otherNode && equals(this, otherNode);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-issamenode
   */
  isSameNode(otherNode: Node | null): boolean {
    // return true if otherNode is this; otherwise false.
    return this === otherNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
   */
  compareDocumentPosition(other: Node): number {
    // 1. If this is other, then return zero.
    if (this === other) return 0;

    // 2. Let node1 be other and node2 be this.
    let node1: Node | null = other;
    // deno-lint-ignore no-this-alias
    let node2: Node | Element | null = this;
    let attr1: Attr | null = null;
    let attr2: Attr | null = null;

    // 4. node1 is an attribute, then set attr1 to node1 and node1 to attr1’s element.
    if (isAttr(node1)) attr1 = node1, node1 = attr1[$element];

    // 5. If node2 is an attribute, then:
    if (isAttr(node2)) {
      // 1. Set attr2 to node2 and node2 to attr2’s element.
      attr2 = node2, node2 = attr2[$element];

      // 2. If attr1 and node1 are non-null, and node2 is node1, then:
      if (!!attr1 && !!node1 && node2 === node1) {
        // 2. For each attr in node2’s attribute list:
        for (const attr of (node2 as Element)[$attributeList]) {
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
    if (!node1 || !node2 || getRoot(node1) !== getRoot(node2)) {
      return Position.DOCUMENT_POSITION_DISCONNECTED +
        Position.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC +
        Position.DOCUMENT_POSITION_PRECEDING;
    }

    // 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2 and attr2 is non-null, then return the result of adding DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
    if ((isAncestorOf(node1, node2) && !attr1) || (node1 === node2 && !attr2)) {
      return Position.DOCUMENT_POSITION_CONTAINS +
        Position.DOCUMENT_POSITION_PRECEDING;
    }

    // 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2 and attr1 is non-null, then return the result of adding DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
    if (
      (isDescendantOf(node1, node2) && !attr2) ||
      (node1 === node2 && attr1)
    ) {
      return Position.DOCUMENT_POSITION_CONTAINED_BY +
        Position.DOCUMENT_POSITION_FOLLOWING;
    }

    // 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
    if (isPrecedeOf(node1, node2)) return Position.DOCUMENT_POSITION_PRECEDING;

    // 10. Return DOCUMENT_POSITION_FOLLOWING.
    return Position.DOCUMENT_POSITION_FOLLOWING;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-contains
   */
  contains(other: Node | null): boolean {
    if (!other) return false;

    // return true if other is an inclusive descendant of this; otherwise false (including when other is null).
    return isInclusiveDescendantOf(other, this);
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
  insertBefore<T>(node: T & Node, child: Child | null): T {
    // return the result of pre-inserting node into this before child.
    return preInsertNode(node, this, child) as T;
  }

  appendChild<T>(node: T & Node): T {
    return appendNode(node, this) as T;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-node-replacechild)
   */
  replaceChild<T>(node: T & Node, child: T): T {
    // return the result of replacing child with node within this.
    return replaceChild<T & Node>(child as any, node, this);
  }

  removeChild<T>(child: T & Node): T {
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
  ${[...this._children].map((node) => this[inspect].call(node)).join("")}`;
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

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
 */
export function getElementsByQualifiedName(
  qualifiedName: string,
  root: Node,
): HTMLCollection {
  // 1. If qualifiedName is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches only descendant elements.
  if (qualifiedName === "*") {
    return new HTMLCollection({ root, filter: (node) => node !== root });
  }

  // 2. Otherwise, if root’s node document is an HTML document, return an HTMLCollection rooted at root, whose filter matches the following descendant elements:
  if (root[$nodeDocument]._type !== "xml") {
    return new HTMLCollection({
      root,
      filter: (element) =>
        element !== root &&
          // - Whose namespace is the HTML namespace and whose qualified name is qualifiedName, in ASCII lowercase.
          (element[$namespace] === Namespace.HTML &&
            getQualifiedName(element) === toASCIILowerCase(qualifiedName)) ||
        // - Whose namespace is not the HTML namespace and whose qualified name is qualifiedName.
        (element[$namespace] !== Namespace.HTML &&
          getQualifiedName(element) === qualifiedName),
    });
  }

  // 3. Otherwise, return an HTMLCollection rooted at root, whose filter matches descendant elements whose qualified name is qualifiedName.
  return new HTMLCollection({
    root,
    filter: (element) =>
      element !== root && getQualifiedName(element) === qualifiedName,
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 */
export function getElementsByClassName(
  classNames: string,
  root: Node,
): HTMLCollection {
  const classes = parseOrderSet(classNames);

  if (classes.isEmpty) return new HTMLCollection({ root, filter: () => false });

  const match = root[$nodeDocument][$mode] === html.DOCUMENT_MODE.QUIRKS
    ? matchASCIICaseInsensitive
    : Object.is;

  return new HTMLCollection({
    root,
    filter: (node) => {
      if (node === root) return false;

      return every(classes, (left) => {
        for (const right of node.classList) if (match(left, right)) return true;

        return false;
      });
    },
  });
}

/**
 * @see https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 */
export function getElementsByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  root: Node,
): HTMLCollection {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. If both namespace and localName are U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements.
  if (namespace === "*" && localName === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => root !== element,
    });
  }

  // 3. If namespace is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements whose local name is localName.
  if (namespace === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => {
        if (element === root) return false;

        return element[$localName] === localName;
      },
    });
  }

  // 4. If localName is U+002A (*), then return an HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace.
  if (localName === "*") {
    return new HTMLCollection({
      root,
      filter: (element) => {
        if (element === root) return false;

        return element[$namespace] === namespace;
      },
    });
  }

  // 5. Return an HTMLCollection rooted at root, whose filter matches descendant elements whose namespace is namespace and local name is localName.
  return new HTMLCollection({
    root,
    filter: (element) => {
      if (element === root) return false;

      return element[$namespace] === namespace &&
        element[$localName] === localName;
    },
  });
}

/**
 * @see https://dom.spec.whatwg.org/#parent-element
 */
export function getParentElement(node: Node): Element | null {
  const parent = node._parent;

  // If the node has a parent of a different type, its parent element is null.
  return parent && isElement(parent) ? parent : null;
}

function getInterface(node: Node, nodeType: NodeType): Element | null {
  switch (nodeType) {
    case NodeType.ELEMENT_NODE:
      // Return the result of locating a namespace prefix for it using namespace.
      return (node as Element);
    case NodeType.DOCUMENT_NODE:
      // Return the result of locating a namespace prefix for its document element, if its document element is non-null; otherwise null.
      return getDocumentElement(node);
    case NodeType.DOCUMENT_TYPE_NODE:
    case NodeType.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;
    case NodeType.ATTRIBUTE_NODE:
      // Return the result of locating a namespace prefix for its element, if its element is non-null; otherwise null.
      return (node as Attr)[$element];
    default:
      // Return the result of locating a namespace prefix for its parent element, if its parent element is non-null; otherwise null.
      return getParentElement(node);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#locate-a-namespace-prefix
 */
export function locateNamespacePrefix(
  element: Element,
  namespace: string,
): string | null {
  // 1. If element’s namespace is namespace and its namespace prefix is non-null, then return its namespace prefix.
  if (element[$namespace] === namespace && element[$namespacePrefix] !== null) {
    return element[$namespacePrefix];
  }

  // 2. If element has an attribute whose namespace prefix is "xmlns" and value is namespace, then return element’s first such attribute’s local name.
  const attribute = find(
    element[$attributeList],
    (attr) =>
      attr[$namespacePrefix] === Namespace.XMLNS && attr[$value] === namespace,
  );

  if (attribute) return attribute[$localName];

  // 3. If element’s parent element is not null, then return the result of running locate a namespace prefix on that element using namespace.
  const parent = getParentElement(element);

  if (parent) return locateNamespacePrefix(parent, namespace);

  // 4. Return null.
  return null;
}

/**
 * @see https://dom.spec.whatwg.org/#locate-a-namespace
 */
export function locateNamespace(
  node: Node,
  prefix: string | null,
): string | null {
  // switch on the interface node implements:
  switch (node.nodeType) {
    case NodeType.ELEMENT_NODE: {
      // 1. If prefix is "xml", then return the XML namespace.
      if (prefix === "xml") return Namespace.XML;

      // 2. If prefix is "xmlns", then return the XMLNS namespace.
      if (prefix === "xmlns") return Namespace.XMLNS;

      const element = node as Element;
      const namespace = element[$namespace];

      // 3. If its namespace is non-null and its namespace prefix is prefix, then return namespace.
      if (namespace !== null && element[$namespacePrefix] === prefix) {
        return namespace;
      }

      const attrList = element[$attributeList];

      // 4. If it has an attribute whose namespace is the XMLNS namespace, namespace prefix is "xmlns", and local name is prefix,
      const hasAttr = find(
        attrList,
        (attr) =>
          attr[$namespace] === Namespace.XMLNS &&
          attr[$namespacePrefix] === "xmlns" &&
          attr[$localName] === prefix,
      );
      // or if prefix is null and it has an attribute whose namespace is the XMLNS namespace, namespace prefix is null, and local name is "xmlns",
      const attribute = hasAttr ??
        (prefix === null
          ? find(attrList, (attr) =>
            attr[$namespace] === Namespace.XMLNS &&
            attr[$namespacePrefix] === null &&
            attr[$localName] === "xmlns")
          : null);

      // then return its value if it is not the empty string, and null otherwise.
      if (attribute) return attribute[$value] || null;

      const parentElement = getParentElement(element);

      // 5. If its parent element is null, then return null.
      if (parentElement === null) return null;

      // 6. Return the result of running locate a namespace on its parent element using prefix.
      return locateNamespace(parentElement, prefix);
    }

    case NodeType.DOCUMENT_NODE: {
      const documentElement = getDocumentElement(node);
      // 1. If its document element is null, then return null.
      if (documentElement === null) return null;

      // 2. Return the result of running locate a namespace on its document element using prefix.
      return locateNamespace(documentElement, prefix);
    }

    case NodeType.DOCUMENT_TYPE_NODE:
    case NodeType.DOCUMENT_FRAGMENT_NODE:
      // Return null.
      return null;

    case NodeType.ATTRIBUTE_NODE: {
      const element = (node as Attr)[$element];

      // 1. If its element is null, then return null.
      if (element === null) return null;

      // 2. Return the result of running locate a namespace on its element using prefix.
      return locateNamespace(element, prefix);
    }

    default: {
      const parentElement = getParentElement(node);

      // 1. If its parent element is null, then return null.
      if (parentElement === null) return null;

      // 2. Return the result of running locate a namespace on its parent element using prefix.
      return locateNamespace(parentElement, prefix);
    }
  }
}

export function equals(A: Node, B: Node): boolean {
  // A and B implement the same interfaces.
  if (A.nodeType !== B.nodeType) return false;

  // A and B have the same number of children.
  if (A._children.size !== B._children.size) return false;

  // The following are equal, switching on the interface A implements:
  if (!equalsInternalSlot(A, B)) return false;

  const pair = izip(A._children, B._children);

  // Each child of A equals the child of B at the identical index.
  return every(pair, ([left, right]) => equals(left, right));
}

export function equalsDocumentType(
  left: DocumentType,
  right: DocumentType,
): boolean {
  return left[$name] === right[$name] &&
    left[$publicId] === right[$publicId] &&
    left[$systemId] === right[$systemId];
}

export function equalsInternalSlot(left: Node, right: Node): boolean {
  switch (left.nodeType) {
    case NodeType.DOCUMENT_TYPE_NODE:
      return equalsDocumentType(<DocumentType> left, <DocumentType> right);

    case NodeType.ELEMENT_NODE:
      return equalsElement(<Element> left, <Element> right);
    case NodeType.ATTRIBUTE_NODE:
      return equalsAttr(<Attr> left, <Attr> right);
    case NodeType.PROCESSING_INSTRUCTION_NODE:
      return equalsProcessingInstruction(
        <ProcessingInstruction> left,
        <ProcessingInstruction> right,
      );
    case NodeType.TEXT_NODE:
    case NodeType.CDATA_SECTION_NODE:
    case NodeType.COMMENT_NODE:
      return equalsCharacterData(<CharacterData> left, <CharacterData> right);
    default:
      return true;
  }
}

export function equalsElement(left: Element, right: Element): boolean {
  return left[$namespace] === right[$namespace] &&
    left[$namespacePrefix] === right[$namespacePrefix] &&
    left[$localName] === right[$localName] &&
    left[$attributeList].size === right[$attributeList].size &&
    // each attribute in its attribute list has an attribute that equals an attribute in B’s attribute list.
    // TODO:(miyauci) improve performance. O(n²)
    every(
      left[$attributeList],
      (left) => some(right[$attributeList], (right) => equalsAttr(left, right)),
    );
}

export function equalsAttr(left: Attr, right: Attr): boolean {
  // Its namespace, local name, and value.
  return left === right || left[$namespace] === right[$namespace] &&
      left[$localName] === right[$localName] && left[$value] === right[$value];
}

export function equalsCharacterData(
  left: CharacterData,
  right: CharacterData,
): boolean {
  return left[$data] === right[$data];
}

export function equalsProcessingInstruction(
  left: ProcessingInstruction,
  right: ProcessingInstruction,
): boolean {
  return equalsCharacterData(left, right) && left[$target] === right[$target];
}

/**
 * @see https://dom.spec.whatwg.org/#contiguous-text-nodes
 */
function* contiguousTextNodesExclusive(node: Node): Iterable<Text> {
  const preceding = getPrecedingSiblings(node) as Iterable<Node>;
  const precedingTexts: Iterable<Text> = takewhile(
    preceding,
    isText,
  ) as Iterable<never>;
  const following = getFollowingSiblings(node);
  const followingTexts: Iterable<Text> = takewhile(
    following,
    isText,
  ) as Iterable<never>;

  yield* [...precedingTexts].reverse();
  yield* followingTexts;
}
