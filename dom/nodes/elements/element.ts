import { Node, NodeStates, NodeType } from "../node.ts";
import {
  getElementsByClassName,
  getElementsByNamespaceAndLocalName,
  getElementsByQualifiedName,
} from "../node_utils.ts";
import { getQualifiedName, UnImplemented } from "../utils.ts";
import { Attr, cloneAttr } from "./attr.ts";
import { changeAttributes, handleAttributesChanges } from "./attr_utils.ts";
import { ParentNode } from "../node_trees/parent_node.ts";
import { NonDocumentTypeChildNode } from "../node_trees/non_document_type_child_node.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import { isHTMLDocument } from "../documents/document.ts";
import { CustomElementDefinition } from "../../../html/custom_element.ts";
import { Namespace, validateAndExtract } from "../../../infra/namespace.ts";
import { List } from "../../../infra/data_structures/list.ts";
import { descendantTextContent, Text } from "../text.ts";
import { find, map, some, xmlValidator } from "../../../deps.ts";
import type { IElement } from "../../../interface.d.ts";
import { preInsertNode, replaceAllNode } from "../node_trees/mutation.ts";
import { ARIAMixin } from "../../../wai_aria/aria_mixin.ts";
import { Animatable } from "../../../web_animations/animatable.ts";
import { InnerHTML } from "../../../domparsing/inner_html.ts";
import { ChildNode } from "../node_trees/child_node.ts";
import { Slottable } from "../node_trees/slottable.ts";
import { DOMTokenList } from "../../sets/dom_token_list.ts";
import { Element_CSSOMView } from "../../../cssom_view/element.ts";
import { Element_CSSTypedOM } from "../../../css/css_typed_om/element.ts";
import { Element_DomParsing } from "../../../domparsing/element.ts";
import { Element_PointerEvents } from "../../../pointerevents/element.ts";
import { Element_PointerLock } from "../../../pointerlock/element.ts";
import { Element_Fullscreen } from "../../../fullscreen/element.ts";
import { Element_CSSShadowParts } from "../../../css/css_shadow_parts/element.ts";
import { DOMExceptionName } from "../../../webidl/exception.ts";
import { PutForwards, SameObject } from "../../../webidl/extended_attribute.ts";
import { convert, DOMString } from "../../../webidl/types.ts";
import { createElement } from "./element_algorithm.ts";
import { toASCIILowerCase } from "../../../infra/string.ts";
import { Steps } from "../../infra/applicable.ts";
import { $, internalSlots, tree } from "../../../internal.ts";

/**
 * [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-custom-element-state)
 */
enum CustomElementState {
  Undefined = "undefined",
  Failed = "failed",
  Uncustomized = "uncustomized",
  Precustomized = "precustomized",
  Custom = "custom",
}

export interface ElementInits {
  namespace: string | null;
  namespacePrefix: string | null;
  localName: string;
  customElementState: CustomElementState;
  customElementDefinition: CustomElementDefinition | null;
  isValue: string | null;
}

@ARIAMixin
@Animatable
@ChildNode
@InnerHTML
@NonDocumentTypeChildNode
@ParentNode
@Slottable
@Element_CSSOMView
@Element_CSSTypedOM
@Element_DomParsing
@Element_PointerEvents
@Element_PointerLock
@Element_Fullscreen
@Element_CSSShadowParts
export class Element extends Node implements IElement {
  constructor({
    namespace,
    namespacePrefix,
    localName,
    customElementState,
    customElementDefinition,
    isValue,
    nodeDocument,
  }: ElementInits & NodeStates) {
    super(nodeDocument);

    const changeAttribute = (
      { localName, namespace, value }: AttributesContext,
    ): void => {
      // 1. If localName is id, namespace is null, and value is null or the empty string, then unset element’s ID.
      if (localName === "id" && namespace === null) {
        // 2. Otherwise, if localName is id, namespace is null, then set element’s ID to value.
        this._.ID = value ? value : null;
      }
    };

    const internal = new ElementInternals({
      namespace,
      namespacePrefix,
      localName,
      customElementState,
      customElementDefinition,
      isValue,
    });
    const _ = Object.assign(this._, internal);

    _.attributeChangeSteps.define(changeAttribute);
    this._ = _;

    internalSlots.set(this, _);
  }

  override get nodeType(): NodeType.ELEMENT_NODE {
    return NodeType.ELEMENT_NODE;
  }

  override get nodeName(): string {
    return this.#upperQualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(_: unknown) {
    // noop
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): string {
    return descendantTextContent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    value ??= "";

    // String replace all with the given value within this.
    replaceAllString(value, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return $(this).nodeDocument;
  }

  protected override clone(document: Document): Element {
    // 1. Let copy be the result of creating an element, given document, node’s local name, node’s namespace, node’s namespace prefix, and node’s is value, with the synchronous custom elements flag unset.
    const copy = createElement(
      document,
      this._.localName,
      this._.namespace,
      this._.namespacePrefix,
      this._.isValue,
    );

    // 2. For each attribute in node’s attribute list:
    for (const attribute of this._.attributeList) {
      // 1. Let copyAttribute be a clone of attribute.
      const copyAttribute = cloneAttr(attribute, document);

      // 2. Append copyAttribute to copy.
      appendAttribute(copyAttribute, copy);
    }

    return copy;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-classlist
   */
  @SameObject
  @PutForwards("value")
  get classList(): DOMTokenList {
    // return a DOMTokenList object whose associated element is this and whose associated attribute’s local name is class.
    return new DOMTokenList({ element: this, localName: "class" });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-classname
   */
  get className(): string {
    // TODO(miyauci): use auto-accessor and accessor decorator
    return getAttributeValue(this, "class");
  }

  set className(value: string) {
    setAttributeValue(this, "class", value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-id
   */
  get id(): string {
    // reflect "id".
    return getAttributeValue(this, "id");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-id
   */
  set id(value: string) {
    setAttributeValue(this, "id", value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-localname
   */
  get localName(): string {
    return this._.localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-namespaceuri
   */
  get namespaceURI(): string | null {
    // return this’s namespace.
    return this._.namespace;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-tagname
   */
  get tagName(): string {
    return this.#upperQualifiedName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-prefix
   */
  get prefix(): string | null {
    // return this’s namespace prefix.
    return this._.namespacePrefix;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-element-shadowroot)
   */
  get shadowRoot(): ShadowRoot | null {
    // 1. Let shadow be this’s shadow root.
    const shadow = this._.shadowRoot;

    // 2. If shadow is null or its mode is "closed", then return null.
    if (!shadow || $(shadow).mode === "closed") return null;

    // 3. Return shadow.
    return shadow;
  }

  get slot(): string {
    return reflectGet(this, "slot");
  }

  set slot(value: string) {
    reflectSet(this, "slot", value);
  }

  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new UnImplemented("attachShadow");
  }

  closest<K extends keyof HTMLElementTagNameMap>(
    selector: K,
  ): HTMLElementTagNameMap[K] | null;
  closest<K extends keyof SVGElementTagNameMap>(
    selector: K,
  ): SVGElementTagNameMap[K] | null;
  closest<K extends keyof MathMLElementTagNameMap>(
    selector: K,
  ): MathMLElementTagNameMap[K] | null;
  closest<E extends Element = Element>(
    selectors: string,
  ): E | null;
  closest<E extends Element = Element>(
    selectors: string,
  ): E | null {
    throw new UnImplemented("closest");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattribute
   */
  getAttribute(qualifiedName: string): string | null {
    // 1. Let attr be the result of getting an attribute given qualifiedName and this.
    const attr = getAttributeByName(qualifiedName, this);

    // 2. If attr is null, return null.
    if (attr === null) return attr;

    // 3. Return attr’s value.
    return $(attr).value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattributens
   */
  getAttributeNS(namespace: string | null, localName: string): string | null {
    // 1. Let attr be the result of getting an attribute given namespace, localName, and this.
    const attr = getAttributeByNamespaceAndLocalName(
      namespace,
      localName,
      this,
    );

    // 2. If attr is null, return null.
    if (attr === null) return attr;

    // 3. Return attr’s value.
    return $(attr).value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattributenames
   */
  getAttributeNames(): string[] {
    // return the qualified names of the attributes in this’s attribute list, in order; otherwise a new list.
    const qualifiedNames = map(
      this._.attributeList,
      (attr) => getQualifiedName($(attr).localName, $(attr).namespacePrefix),
    );

    return qualifiedNames;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattributenode
   */
  getAttributeNode(qualifiedName: string): globalThis.Attr | null {
    // return the result of getting an attribute given qualifiedName and this.
    return getAttributeByName(qualifiedName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getattributenodens
   */
  getAttributeNodeNS(
    namespace: string | null,
    localName: string,
  ): globalThis.Attr | null {
    // return the result of getting an attribute given namespace, localName, and this.
    return getAttributeByNamespaceAndLocalName(namespace, localName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getelementsbyclassname
   */
  @convert
  getElementsByClassName(
    @DOMString classNames: string,
  ): HTMLCollection {
    // return the list of elements with class names classNames for this.
    return getElementsByClassName(classNames, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-getelementsbytagname
   */
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(
    qualifiedName: string,
  ): HTMLCollectionOf<Element>;
  getElementsByTagName(
    qualifiedName: string,
  ): HTMLCollection {
    return getElementsByQualifiedName(qualifiedName, this);
  }

  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/1999/xhtml",
    localName: string,
  ): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/2000/svg",
    localName: string,
  ): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(
    namespaceURI: "http://www.w3.org/1998/Math/MathML",
    localName: string,
  ): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(
    namespace: string | null,
    localName: string,
  ): HTMLCollectionOf<globalThis.Element>;
  getElementsByTagNameNS(
    namespace: string | null,
    localName: string,
  ): HTMLCollectionOf<globalThis.Element> {
    return getElementsByNamespaceAndLocalName(namespace, localName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-hasattribute
   */
  hasAttribute(qualifiedName: string): boolean {
    // 1. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
    if (
      this._.namespace === Namespace.HTML &&
      isHTMLDocument($(this).nodeDocument)
    ) qualifiedName = toASCIILowerCase(qualifiedName);

    // 2. Return true if this has an attribute whose qualified name is qualifiedName; otherwise false.
    return hasAttributeByQualifiedName(qualifiedName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-attributes
   */
  @SameObject
  get attributes(): NamedNodeMap {
    return new NamedNodeMap({
      attributeList: this._.attributeList,
      element: this,
    });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-hasattributens
   */
  hasAttributeNS(namespace: string | null, localName: string): boolean {
    // 1. If namespace is the empty string, then set it to null.
    namespace ||= null;

    // 2. Return true if this has an attribute whose namespace is namespace and local name is localName; otherwise false.
    return some(
      this._.attributeList,
      (attr) =>
        $(attr).namespace === namespace && $(attr).localName === localName,
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-hasattributes
   */
  hasAttributes(): boolean {
    // return false if this’s attribute list is empty; otherwise true.
    return !this._.attributeList.isEmpty;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
   */
  insertAdjacentElement(
    where: InsertPosition,
    element: Element,
  ): Element | null {
    // result of running insert adjacent, give this, where, and element.
    return insertAdjacent(this, where, element) as Element | null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
   */
  insertAdjacentText(where: InsertPosition, data: string): void {
    // 1. Let text be a new Text node whose data is data and node document is this’s node document.
    const text = Text["create"]({ data, nodeDocument: $(this).nodeDocument });

    // 2. Run insert adjacent, given this, where, and text.
    insertAdjacent(this, where, text);
  }

  matches(selectors: string): boolean {
    throw new UnImplemented("matches");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-removeattribute
   */
  removeAttribute(qualifiedName: string): void {
    // remove an attribute given qualifiedName and this, and then return undefined.
    removeAttributeByName(qualifiedName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-removeattributens
   */
  removeAttributeNS(namespace: string | null, localName: string): void {
    // remove an attribute given namespace, localName, and this, and then return undefined.
    removeAttributeByNamespaceAndLocalName(namespace, localName, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-removeattributenode
   */
  removeAttributeNode(attr: Attr): Attr {
    // 1. If this’s attribute list does not contain attr, then throw a "NotFoundError" DOMException.
    if (!this._.attributeList.contains(attr)) {
      throw new DOMException("<message>", DOMExceptionName.NotFoundError);
    }

    // 2. Remove attr.
    removeAttribute(attr);

    // 3. Return attr.
    return attr;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattribute
   */
  setAttribute(qualifiedName: string, value: string): void {
    // 1. If qualifiedName does not match the Name production in XML, then throw an "InvalidCharacterError" DOMException.
    if (!xmlValidator.name(qualifiedName)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
    if (
      this._.namespace === Namespace.HTML &&
      isHTMLDocument($(this).nodeDocument)
    ) qualifiedName = toASCIILowerCase(qualifiedName);

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is qualifiedName, and null otherwise.
    const attribute = find(
      this._.attributeList,
      (attr) => $(attr).qualifiedName === qualifiedName,
    ) ?? null;

    // 4. If attribute is null, create an attribute whose local name is qualifiedName, value is value, and node document is this’s node document, then append this attribute to this, and then return.
    if (attribute === null) {
      const attribute = new Attr({
        localName: qualifiedName,
        value,
        nodeDocument: $(this).nodeDocument,
      });

      appendAttribute(attribute, this);
      return;
    }

    // 5. Change attribute to value.
    changeAttributes(attribute, value);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributens
   */
  setAttributeNS(
    namespace: string | null,
    qualifiedName: string,
    value: string,
  ): void {
    // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName to validate and extract.
    const { namespace: ns, prefix, localName } = validateAndExtract(
      namespace,
      qualifiedName,
    );

    // 2. Set an attribute value for this using localName, value, and also prefix and namespace.
    setAttributeValue(this, localName, value, prefix, ns);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributenode
   */
  setAttributeNode(attr: globalThis.Attr): globalThis.Attr | null {
    // to return the result of setting an attribute given attr and this.
    return setAttribute(attr, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-setattributenodens
   */
  setAttributeNodeNS(attr: globalThis.Attr): globalThis.Attr | null {
    // to return the result of setting an attribute given attr and this.
    return setAttribute(attr, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-toggleattribute
   */
  toggleAttribute(qualifiedName: string, force?: boolean): boolean {
    // 1. If qualifiedName does not match the Name production in XML, then throw an "InvalidCharacterError" DOMException.
    if (!xmlValidator.name(qualifiedName)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
    if (
      this._.namespace === Namespace.HTML &&
      isHTMLDocument($(this).nodeDocument)
    ) qualifiedName = toASCIILowerCase(qualifiedName);

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is qualifiedName, and null otherwise.
    const attribute = find(
      this._.attributeList,
      (attr) => $(attr).qualifiedName === qualifiedName,
    ) ?? null;

    // 4. If attribute is null, then:
    if (!attribute) {
      // 1. If force is not given or is true,
      if (typeof force === "undefined" || force) {
        // create an attribute whose local name is qualifiedName, value is the empty string, and node document is this’s node document,
        const attr = new Attr({
          localName: qualifiedName,
          value: "",
          nodeDocument: $(this).nodeDocument,
        });

        // then append this attribute to this,
        appendAttribute(attr, this);

        // and then return true.
        return true;
      }

      // 2. Return false.
      return false;
    }

    // 5. Otherwise, if force is not given or is false, remove an attribute given qualifiedName and this, and then return false.
    if (!force) {
      removeAttributeByName(qualifiedName, this);
      return false;
    }

    // 6. Return true.
    return true;
  }

  webkitMatchesSelector(selectors: string): boolean {
    throw new UnImplemented("webkitMatchesSelector");
  }

  declare protected _: ElementInternals & Node["_"];

  /**
   * @see https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
   */
  get #upperQualifiedName(): string {
    // 1. Let qualifiedName be this’s qualified name.
    let qualifiedName = this._.qualifiedName;

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII uppercase.
    if (
      this._.namespace === Namespace.HTML &&
      $($(this).nodeDocument).type !== "xml"
    ) {
      qualifiedName = qualifiedName.toUpperCase();
    }

    // 3. Return qualifiedName.
    return qualifiedName;
  }
}

export interface Element
  extends
    ARIAMixin,
    Animatable,
    ChildNode,
    InnerHTML,
    NonDocumentTypeChildNode,
    ParentNode,
    Slottable,
    Element_CSSOMView,
    Element_CSSTypedOM,
    Element_DomParsing,
    Element_PointerEvents,
    Element_PointerLock,
    Element_Fullscreen,
    Element_CSSShadowParts {}

export class ElementInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-namespace)
   */
  namespace: string | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-namespace-prefix)
   */
  namespacePrefix: string | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-local-name)
   */
  localName: string;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-custom-element-state)
   */
  customElementState: CustomElementState;

  customElementDefinition: CustomElementDefinition | null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-is-value)
   */
  isValue: string | null;

  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-shadow-root)
   */
  shadowRoot: ShadowRoot | null = null;

  /**
   * @default new List()
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-attribute)
   */
  attributeList: List<globalThis.Attr> = new List();

  /**
   * @default new Steps()
   * @see [DOM Living Standard]((https://dom.spec.whatwg.org/#concept-element-attributes-change-ext)
   */
  attributeChangeSteps: Steps<[AttributesContext]> = new Steps();

  /**
   * @default null
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-id)
   */
  ID: string | null = null;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-element-qualified-name)
   */
  qualifiedName!: string;

  constructor(
    {
      namespace,
      namespacePrefix,
      localName,
      isValue,
      customElementDefinition,
      customElementState,
    }: Pick<
      ElementInternals,
      | "namespace"
      | "namespacePrefix"
      | "localName"
      | "isValue"
      | "customElementState"
      | "customElementDefinition"
    >,
  ) {
    this.namespace = namespace;
    this.namespacePrefix = namespacePrefix;
    this.localName = localName;
    this.isValue = isValue;
    this.customElementState = customElementState;
    this.customElementDefinition = customElementDefinition;

    Object.defineProperty(this, "qualifiedName", {
      get: () => getQualifiedName(this.localName, this.namespacePrefix),
    });
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-value
 */
export function getAttributeValue(
  element: globalThis.Element,
  localName: string,
  namespace: string | null = null,
): string {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attr is null, then return the empty string.
  if (attr === null) return "";

  // 3. Return attr’s value.
  return $(attr).value;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
 */
export function setAttribute(
  attr: globalThis.Attr,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If attr’s element is neither null nor element, throw an "InUseAttributeError" DOMException.
  if (!($(attr).element === null || $(attr).element === element)) {
    throw new DOMException(
      "The attribute is in use by another element",
      "InUseAttributeError",
    );
  }

  // 2. Let oldAttr be the result of getting an attribute given attr’s namespace, attr’s local name, and element.
  const oldAttr = getAttributeByNamespaceAndLocalName(
    $(attr).namespace,
    $(attr).localName,
    element,
  );

  // 3. If oldAttr is attr, return attr.
  if (oldAttr === attr) return attr;

  // 4. If oldAttr is non-null, then replace oldAttr with attr.
  if (oldAttr) replaceAttribute(oldAttr, attr);
  // 5. Otherwise, append attr to element.
  else appendAttribute(attr, element);

  // 6. Return oldAttr.
  return oldAttr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-set-value
 */
export function setAttributeValue(
  element: globalThis.Element,
  localName: string,
  value: string,
  prefix: string | null = null,
  namespace: string | null = null,
): void {
  // 1. Let attribute be the result of getting an attribute given namespace, localName, and element.
  const attribute = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attribute is null, create an attribute whose namespace is namespace, namespace prefix is prefix, local name is localName, value is value, and node document is element’s node document, then append this attribute to element, and then return.
  if (attribute === null) {
    const attr = new Attr({
      namespace,
      namespacePrefix: prefix,
      localName,
      value,
      nodeDocument: $(element).nodeDocument,
    });

    appendAttribute(attr, element);
    return;
  }
  // 3. Change attribute to value.
  changeAttributes(attribute, value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
 */
export function getAttributeByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If namespace is the empty string, then set it to null.
  namespace ||= null;

  // 2. Return the attribute in element’s attribute list whose namespace is namespace and local name is localName, if any; otherwise null.
  return find(
    $(element).attributeList,
    (attribute) =>
      $(attribute).namespace === namespace &&
      $(attribute).localName === localName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-append
 */
export function appendAttribute(
  attribute: globalThis.Attr,
  element: globalThis.Element,
): void {
  // 1. Append attribute to element’s attribute list.
  $(element).attributeList.append(attribute);

  // 2. Set attribute’s element to element.
  $(attribute).element = element;

  // 3. Handle attribute changes for attribute with element, null, and attribute’s value.
  handleAttributesChanges(attribute, element, null, $(attribute).value);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-replace
 */
export function replaceAttribute(
  oldAttr: globalThis.Attr,
  newAttr: globalThis.Attr,
): void {
  const oldElement = $(oldAttr).element;
  // 1. Replace oldAttr by newAttr in oldAttr’s element’s attribute list.
  oldElement && $(oldElement).attributeList.replace(
    newAttr,
    (attr) => attr === oldAttr,
  );

  // 2. Set newAttr’s element to oldAttr’s element.
  $(newAttr).element = $(oldAttr).element;

  // 3. Set oldAttr’s element to null.
  $(oldAttr).element = null;

  const element = $(newAttr).element;
  // 4. Handle attribute changes for oldAttr with newAttr’s element, oldAttr’s value, and newAttr’s value.
  element &&
    handleAttributesChanges(
      oldAttr,
      element,
      $(oldAttr).value,
      $(newAttr).value,
    );
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove
 */
export function removeAttribute(attribute: globalThis.Attr): void {
  // Unclear whether there is always a element in attribute.
  // 1. Let element be attribute’s element.
  const element = $(attribute).element;

  // 2. Remove attribute from element’s attribute list.
  element && $(element).attributeList.remove((attr) => attr === attribute);

  // 3. Set attribute’s element to null.
  $(attribute).element = null;

  // 4. Handle attribute changes for attribute with element, attribute’s value, and null.
  element &&
    handleAttributesChanges(attribute, element, $(attribute).value, null);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
 */
export function removeAttributeByName(
  qualifiedName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. Let attr be the result of getting an attribute given qualifiedName and element.
  const attr = getAttributeByName(qualifiedName, element);

  // 2. If attr is non-null, then remove attr.
  if (attr) removeAttribute(attr);

  // 3. Return attr.
  return attr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
 */
export function removeAttributeByNamespaceAndLocalName(
  namespace: string | null,
  localName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(
    namespace,
    localName,
    element,
  );

  // 2. If attr is non-null, then remove attr.
  if (attr) removeAttribute(attr);

  // 3. Return attr.
  return attr;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
 */
export function getAttributeByName(
  qualifiedName: string,
  element: globalThis.Element,
): globalThis.Attr | null {
  // 1. If element is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII lowercase.
  if (
    $(element).namespace === Namespace.HTML &&
    $($(element).nodeDocument).type !== "xml"
  ) qualifiedName = toASCIILowerCase(qualifiedName);

  // 2. Return the first attribute in element’s attribute list whose qualified name is qualifiedName; otherwise null.
  return find(
    $(element).attributeList,
    (attribute) => $(attribute).qualifiedName === qualifiedName,
  ) ?? null;
}

/**
 * @see https://dom.spec.whatwg.org/#string-replace-all
 */
export function replaceAllString(
  string: string,
  parent: globalThis.Node,
): void {
  // 1. Let node be null.
  let node: globalThis.Node | null = null;

  // 2. If string is not the empty string, then set node to a new Text node whose data is string and node document is parent’s node document.
  if (string !== "") {
    node = Text["create"]({
      data: string,
      nodeDocument: $(parent).nodeDocument,
    });
  }

  // 3. Replace all with node within parent.
  replaceAllNode(node, parent);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-element-custom
 */
export function isCustom(element: globalThis.Element): boolean {
  // An element whose custom element state is "custom
  return $(element).customElementState === CustomElementState.Custom;
}

export const reflectGet = getAttributeValue;
export const reflectSet = setAttributeValue;

export function hasAttributeByQualifiedName(
  qualifiedName: string,
  element: globalThis.Element,
): boolean {
  for (const attr of $(element).attributeList) {
    if ($(attr).qualifiedName === qualifiedName) return true;
  }

  return false;
}

/**
 * @throws {DOMException}
 * @see https://dom.spec.whatwg.org/#insert-adjacent
 */
export function insertAdjacent(
  element: globalThis.Element,
  where: string,
  node: globalThis.Node,
): globalThis.Node | null {
  // run the steps associated with the first ASCII case-insensitive match for where:
  switch (toASCIILowerCase(where)) {
    case "beforebegin": {
      const parent = tree.parent(element);
      // If element’s parent is null, return null.
      if (!parent) return null;

      // Return the result of pre-inserting node into element’s parent before element.
      return preInsertNode(node, parent, element);
    }
    case "afterbegin": {
      // Return the result of pre-inserting node into element before element’s first child.
      return preInsertNode(node, element, tree.firstChild(element));
    }
    case "beforeend": {
      // Return the result of pre-inserting node into element before null.
      return preInsertNode(node, element, null);
    }
    case "afterend": {
      const parent = tree.parent(element);
      // If element’s parent is null, return null.
      if (!parent) return null;

      // Return the result of pre-inserting node into element’s parent before element’s next sibling.
      return preInsertNode(node, parent, tree.nextSibling(element));
    }
    default:
      // Throw a "SyntaxError" DOMException.
      throw new DOMException("<message>", DOMExceptionName.SyntaxError);
  }
}

export interface AttributesContext {
  element: globalThis.Element;
  localName: string;
  oldValue: string | null;
  value: string | null;
  namespace: string | null;
}
