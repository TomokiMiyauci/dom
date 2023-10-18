import * as $ from "./symbol.ts";
import { html } from "./deps.ts";
import { Steps } from "./infra/applicable.ts";
import { type Encoding } from "./_internals/encoding/encoding.ts";
import type {
  RegisteredObserver,
  TransientRegisteredObserver,
} from "./interface.d.ts";
import {
  Origin,
} from "./_internals/html/loading_web_pages/supporting_concepts.ts";
import type { List } from "./_internals/infra/data_structures/list.ts";
import type { CustomElementState } from "./interface.d.ts";
import { CustomElementDefinition } from "./_internals/html/custom_element.ts";

export interface NodeInternals {
  [$.nodeDocument]: $Document;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-insert-ext)
   */
  [$.insertionSteps]: Steps<[insertedNode: $Node]>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-adopt-ext)
   */
  [$.adoptingSteps]: Steps<[node: $Node, oldDocument: Document]>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-children-changed-ext)
   */
  [$.childrenChangedSteps]: Steps<[]>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-remove-ext)
   */
  [$.removingSteps]: Steps<[removedNode: $Node, oldParent: $Node | null]>;

  /** @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer-list) */
  [$.registeredObserverList]: List<
    RegisteredObserver | TransientRegisteredObserver
  >;
}

export interface CharacterDataInternals extends NodeInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-cd-data)
   */
  [$.data]: string;
}

export interface DocumentTypeInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-name)
   */
  [$.name]: string;

  /**
   * @default ""
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-publicid)
   */
  [$.publicId]: string;

  /**
   * @default ""
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-doctype-systemid)
   */
  [$.systemId]: string;
}

export interface DocumentFragmentInternals extends NodeInternals {
  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-documentfragment-host)
   */
  [$.host]: $Element | null;
}

export interface AttrInternals extends NodeInternals {
  /**
   * @default null
   * @see https://dom.spec.whatwg.org/#concept-attribute-namespace
   */
  [$.namespace]: string | null;

  /**
   * @default null
   * @see https://dom.spec.whatwg.org/#concept-attribute-namespace-prefix
   */
  [$.namespacePrefix]: string | null;

  /**
   * @see https://dom.spec.whatwg.org/#concept-attribute-local-name
   */
  [$.localName]: string;

  /**
   * @default ""
   * @see https://dom.spec.whatwg.org/#concept-attribute-value
   */
  [$.value]: string;

  /**
   * @default null
   * @see https://dom.spec.whatwg.org/#concept-attribute-element
   */
  [$.element]: $Element | null;
}

export interface ElementInternals extends NodeInternals {
  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-namespace)
   */
  [$.namespace]: string | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-namespace-prefix)
   */
  [$.namespacePrefix]: string | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-local-name)
   */
  [$.localName]: string;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-custom-element-state)
   */
  [$.customElementState]: CustomElementState;

  [$.customElementDefinition]: CustomElementDefinition | null;

  /**
   * @default new List()
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-attribute)
   */
  [$.attributeList]: List<$Attr>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-is-value)
   */
  [$.isValue]: string | null;

  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-id)
   */
  [$.ID]: string | null;

  /**
   * @default new Steps()
   * @see [DOM Living Standard]((https://dom.spec.whatwg.org/#concept-element-attributes-change-ext)
   */
  [$.attributeChangeSteps]: Steps<[AttributesContext]>;

  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-shadow-root)
   */
  [$.shadowRoot]: $ShadowRoot | null;
}

export interface AttributesContext {
  element: $Element;
  localName: string;
  oldValue: string | null;
  value: string | null;
  namespace: string | null;
}

export type Doctype = "xml" | "html";

export interface DocumentInternals extends NodeInternals {
  /**
   * @default utf8
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-encoding)
   */
  [$.encoding]: Encoding;

  /**
   * @default "application/xml"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-content-type)
   */
  [$.contentType]: string;

  /**
   * @default new URL("about:blank")
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-url)
   */
  [$.URL]: URL;

  /**
   * @default OpaqueOrigin
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-origin)
   */
  [$.origin]: Origin;

  /**
   * @default "xml"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-type)
   */
  [$.type]: Doctype;

  /**
   * @default "no-quirks"
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-document-mode)
   */
  [$.mode]: html.DOCUMENT_MODE;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#interface-domimplementation)
   */
  [$.implementation]: DOMImplementation;

  /**
   * Non standard field
   * @default Set
   */
  [$.iterators]: Set<NodeIterator>;

  /**
   * Non standard field
   * @default Set
   */
  [$.ranges]: Set<Range>;
}

export interface ProcessingInstructionInternals extends CharacterDataInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-pi-target)
   */
  [$.target]: string;
}

export interface ShadowRootInternals extends DocumentFragmentInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-mode)
   */

  [$.mode]: ShadowRootMode;

  /**
   * @default false
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-delegates-focus)
   */
  [$.delegatesFocus]: boolean;

  /**
   * @default false
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-available-to-element-internals)
   */

  [$.availableElementInternals]: boolean;

  /**
   * @default "named"
   */
  [$.slotAssignment]: SlotAssignmentMode;

  [$.host]: $Element;
}

export interface NodeIteratorInternals {
  /**
   * @default false
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  [$.activeFlag]: boolean;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-root)
  //  */
  // [$.root]: Node;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-whattoshow)
   */
  [$.whatToShow]: number;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-filter)
   */
  [$.filter]: NodeFilter | null;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#iterator-collection)
  //  */
  // [$.iteratorCollection]: Iterable<Node>;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-reference)
  //  */
  // [$.reference]: Node;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pointer-before-reference)
  //  */
  // [$.pointerBeforeReference]: boolean;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#nodeiterator-pre-removing-steps)
  //  */
  // [$.preRemovingSteps]: Steps<[nodeIterator: NodeIterator, toBeRemovedNode: Node]>;
}

export interface TreeWalkerInternals {
  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-traversal-active)
   */
  [$.activeFlag]: boolean | null;

  [$.root]: $Node;

  [$.whatToShow]: number;

  [$.filter]: NodeFilter | null;

  [$.current]: $Node;
}

export interface $Node extends Node, NodeInternals {}

export interface $ParentNode extends ParentNode, NodeInternals {}
export interface $ChildNode extends ChildNode, NodeInternals {}

export interface $DocumentType
  extends globalThis.DocumentType, DocumentTypeInternals {}

export interface $CharacterData extends CharacterData, CharacterDataInternals {}

export interface $Text extends Text, CharacterDataInternals {}

export interface $ProcessingInstruction
  extends ProcessingInstruction, ProcessingInstructionInternals {}

export interface $DocumentFragment
  extends DocumentFragment, DocumentFragmentInternals {}

export interface $Attr extends Attr, AttrInternals {}

export interface $Element extends Element, ElementInternals {}

export interface $Document extends Document, DocumentInternals {}

export interface $ShadowRoot extends ShadowRoot, ShadowRootInternals {}
export interface $Node extends Node, NodeInternals {}
export interface $ParentNode extends ParentNode, NodeInternals {}
export interface $ChildNode extends ChildNode, NodeInternals {}
export interface $NodeIterator extends NodeIterator, NodeIteratorInternals {}
export interface $TreeWalker extends TreeWalker, TreeWalkerInternals {}
