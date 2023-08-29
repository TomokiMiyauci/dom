import { type Node } from "./node.ts";
import { type Document } from "./document.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { Text } from "./text.ts";
import { isElement } from "./utils.ts";
import { type Element } from "./element.ts";
import type { IParentNode } from "../interface.d.ts";
import { StaticNodeList } from "./node_list.ts";
import { matchScopedSelectorsString } from "../trees/selector.ts";
import { HTMLCollection } from "./html_collection.ts";
import {
  Constructor,
  first,
  ifilter,
  isObject,
  isSingle,
  last,
  len,
  map,
} from "../deps.ts";
import { $create, $nodeDocument } from "./internal.ts";
import {
  appendNode,
  ensurePreInsertionValidity,
  preInsertNode,
  replaceAllNode,
} from "./mutation.ts";
import { getFirstChild } from "../trees/tree.ts";
import { convert, DOMString } from "../webidl/types.ts";

export function ParentNode<T extends Constructor<Node>>(
  Ctor: T,
) {
  abstract class ParentNode extends Ctor implements IParentNode {
    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-childelementcount
     */
    get childElementCount(): number {
      // return the number of children of this that are elements.
      return len(ifilter(this._children, isElement));
    }

    get children(): HTMLCollection {
      return new HTMLCollection({
        root: this,
        filter: (node) => {
          return this._children.contains(node);
        },
      });
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-firstelementchild
     */
    get firstElementChild(): Element | null {
      // return the first child that is an element; otherwise null.
      return first(ifilter(this._children, isElement)) ?? null;
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-lastelementchild
     */
    get lastElementChild(): Element | null {
      // return the last child that is an element; otherwise null.
      return last(ifilter(this._children, isElement)) ?? null;
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-prepend
     */
    @convert
    prepend(@DOMString.exclude(isObject) ...nodes: (string | Node)[]): void {
      // 1. Let node be the result of converting nodes into a node given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this[$nodeDocument]);

      // 2. Pre-insert node into this before this’s first child.
      preInsertNode(node, this, getFirstChild(this));
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-append
     */
    append(...nodes: (string | Node)[]): void {
      // Let node be the result of converting nodes into a node given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this[$nodeDocument]);

      // Append node to this.
      appendNode(node, this);
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-replacechildren
     */
    replaceChildren(...nodes: (string | Node)[]): void {
      // 1. Let node be the result of converting nodes into a node given nodes and this’s node document.
      const node = convertNodesToNode(nodes, this[$nodeDocument]);

      // 2. Ensure pre-insertion validity of node into this before null.
      ensurePreInsertionValidity(node, this, null);

      // 3. Replace all with node within this.
      replaceAllNode(node, this);
    }

    /**
     * @see https://dom.spec.whatwg.org/#dom-parentnode-queryselector
     */
    querySelector<K extends keyof HTMLElementTagNameMap>(
      selectors: K,
    ): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(
      selectors: K,
    ): SVGElementTagNameMap[K] | null;
    querySelector<K extends keyof MathMLElementTagNameMap>(
      selectors: K,
    ): MathMLElementTagNameMap[K] | null;
    querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(
      selectors: K,
    ): HTMLElementDeprecatedTagNameMap[K] | null;
    querySelector<E extends Element = Element>(
      selectors: string,
    ): E | null;
    querySelector(
      selectors: string,
    ): Element | null {
      // return the first result of running scope-match a selectors string selectors against this, if the result is not an empty list;
      return matchScopedSelectorsString(selectors, this)[0] ?? null;
    }

    querySelectorAll<K extends keyof HTMLElementTagNameMap>(
      selectors: K,
    ): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(
      selectors: K,
    ): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<K extends keyof MathMLElementTagNameMap>(
      selectors: K,
    ): NodeListOf<MathMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(
      selectors: K,
    ): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
    querySelectorAll<E extends Element = Element>(
      selectors: string,
    ): NodeListOf<E>;
    querySelectorAll(
      selectors: string,
    ): NodeListOf<Element> {
      return new StaticNodeList(
        matchScopedSelectorsString(selectors, this),
      ) as never as NodeListOf<Element>;
    }
  }

  return ParentNode;
}

// deno-lint-ignore no-empty-interface
export interface ParentNode extends IParentNode {}

/**
 * @see https://dom.spec.whatwg.org/#converting-nodes-into-a-node
 */
export function convertNodesToNode(
  nodes: Iterable<Node | string>,
  document: Document,
): Node {
  // 2. Replace each string in nodes with a new Text node whose data is the string and node document is document.
  const replaced = map(nodes, (node) => {
    if (typeof node === "string") {
      return Text[$create]({ data: node, nodeDocument: document });
    }

    return node;
  });

  // 3. If nodes contains one node, then set node to nodes[0].
  if (isSingle(replaced)) return replaced[0];

  // 1. Let node be null. // 4. Otherwise, set node to a new DocumentFragment node whose node document is document, and then append each node in nodes, if any, to it.
  const fragment = DocumentFragment[$create]({ nodeDocument: document });
  replaced.forEach((node) => appendNode(node, fragment));

  // 5. Return node.
  return fragment;
}
