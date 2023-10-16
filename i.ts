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
export interface NodeInternals {
  [$.nodeDocument]: $Document;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-insert-ext)
  //  */
  // [$.insertionSteps]: Steps<[insertedNode: globalThis.Node]>;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-adopt-ext)
  //  */
  // [$.adoptingSteps]: Steps<[node: globalThis.Node, oldDocument: Document]>;
  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-children-changed-ext)
  //  */
  // [$.childrenChangedSteps]: Steps<[]>;

  // /**
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-remove-ext)
  //  */
  // [$.removingSteps]: Steps<
  //   [removedNode: globalThis.Node, oldParent: globalThis.Node | null]
  // >;

  // /** @see [DOM Living Standard](https://dom.spec.whatwg.org/#registered-observer-list) */
  // [$.registeredObserverList]: List<
  //   RegisteredObserver | TransientRegisteredObserver
  // >;
}

export interface CharacterDataInternals {
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
  [$.host]: Element | null;
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
  // /**
  //  * @default null
  //  * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-namespace)
  //  */
  // [$.namespace]: string | null;

  /**
   * @default new List()
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-attribute)
   */
  [$.attributeList]: List<$Attr>;
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
  [$.ranges]: Set<globalThis.Range>;
}

export interface $Node extends Node, NodeInternals {}

export interface $ParentNode extends ParentNode, NodeInternals {}
export interface $ChildNode extends ChildNode, NodeInternals {}

export interface $DocumentType
  extends globalThis.DocumentType, DocumentTypeInternals {}

export interface $CharacterData extends CharacterData, CharacterDataInternals {}

export interface $Text extends Text, CharacterDataInternals {}

export interface $ProcessingInstruction
  extends ProcessingInstruction, CharacterDataInternals {}

export interface $DocumentFragment
  extends DocumentFragment, DocumentFragmentInternals {}

export interface $Attr extends Attr, AttrInternals {}

export interface $Element extends Element, ElementInternals {}

export interface $Document extends Document, DocumentInternals {}
