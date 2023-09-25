import { Node, NodeStates, NodeType } from "../node.ts";
import {
  getElementsByClassName,
  getElementsByNamespaceAndLocalName,
  getElementsByQualifiedName,
} from "../node_utils.ts";
import { getQualifiedName, isShadowHost, UnImplemented } from "../utils.ts";
import { Attr, cloneAttr } from "./attr.ts";
import { changeAttributes } from "./attr_utils.ts";
import { ParentNode } from "../node_trees/parent_node.ts";
import { NonDocumentTypeChildNode } from "../node_trees/non_document_type_child_node.ts";
import { NamedNodeMap } from "./named_node_map.ts";
import { isHTMLDocument } from "../documents/document_utils.ts";
import {
  CustomElementDefinition,
  isValidCustomElementName,
  lookUpCustomElementDefinition,
} from "../../../html/custom_element.ts";
import { Namespace, validateAndExtract } from "../../../infra/namespace.ts";
import { List } from "../../../infra/data_structures/list.ts";
import { Text } from "../text.ts";
import { find, map, some, xmlValidator } from "../../../deps.ts";
import type { IElement } from "../../../interface.d.ts";
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
import { createElement } from "../utils/create_element.ts";
import { toASCIILowerCase } from "../../../infra/string.ts";
import { Steps } from "../../infra/applicable.ts";
import { $, internalSlots, tree } from "../../../internal.ts";
import { ShadowRoot } from "../shadow_root.ts";
import {
  appendAttribute,
  CustomElementState,
  getAttributeByName,
  getAttributeByNamespaceAndLocalName,
  getAttributeValue,
  hasAttributeByQualifiedName,
  insertAdjacent,
  isValidShadowHostName,
  reflectGet,
  removeAttribute,
  removeAttributeByName,
  removeAttributeByNamespaceAndLocalName,
  setAttribute,
} from "./element_utils.ts";
import { reflectSet, setAttributeValue } from "../utils/set_attribute_value.ts";
import { replaceAllString } from "../utils/replace_all_string.ts";
import { matchSelector, parseSelector } from "../../../selectors/hook.ts";

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
@InnerHTML
@ParentNode
@NonDocumentTypeChildNode
@ChildNode
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
        this.#_.ID = value ? value : null;
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
    internal.attributeChangeSteps.define(changeAttribute);
    internalSlots.extends<Element>(this, internal);
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
    return tree.descendantTextContent(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    value ??= "";
    value = String(value); // TODO DOMString setter

    // String replace all with the given value within this.
    replaceAllString(value, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  override get ownerDocument(): Document {
    // return null, if this is a document; otherwise this’s node document.
    // Document should override this.
    return this.#_.nodeDocument;
  }

  protected override clone(document: Document): Element {
    // 1. Let copy be the result of creating an element, given document, node’s local name, node’s namespace, node’s namespace prefix, and node’s is value, with the synchronous custom elements flag unset.
    const copy = createElement(
      document,
      this.#_.localName,
      this.#_.namespace,
      this.#_.namespacePrefix,
      this.#_.isValue,
    );

    // 2. For each attribute in node’s attribute list:
    for (const attribute of this.#_.attributeList) {
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
    return this.#_.localName;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-namespaceuri
   */
  get namespaceURI(): string | null {
    // return this’s namespace.
    return this.#_.namespace;
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
    return this.#_.namespacePrefix;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-element-shadowroot)
   */
  get shadowRoot(): globalThis.ShadowRoot | null {
    // 1. Let shadow be this’s shadow root.
    const shadow = this.#_.shadowRoot;

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

  attachShadow(init: ShadowRootInit): globalThis.ShadowRoot {
    init.slotAssignment ??= "named";
    init.delegatesFocus ??= false;

    // 1. If this’s namespace is not the HTML namespace, then throw a "NotSupportedError" DOMException.
    if (this.#_.namespace !== Namespace.HTML) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 2. If this’s local name is not a valid shadow host name, then throw a "NotSupportedError" DOMException.
    if (!isValidShadowHostName(this.#_.localName)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 3. If this’s local name is a valid custom element name, or this’s is value is not null, then:
    if (
      isValidCustomElementName(this.#_.localName) || this.#_.isValue !== null
    ) {
      // 1. Let definition be the result of looking up a custom element definition given this’s node document, its namespace, its local name, and its is value.
      const definition = lookUpCustomElementDefinition(
        this.#_.nodeDocument,
        this.#_.namespace,
        this.#_.localName,
        this.#_.isValue,
      );

      // 2. If definition is not null and definition’s disable shadow is true, then throw a "NotSupportedError" DOMException.
      if (definition && definition.disableShadow) {
        throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
      }
    }

    // 4. If this is a shadow host, then throw an "NotSupportedError" DOMException.
    if (isShadowHost(this)) {
      throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 5. Let shadow be a new shadow root whose node document is this’s node document, host is this, and mode is init["mode"].
    const shadow = new ShadowRoot({ host: this }) as globalThis.ShadowRoot;
    $(shadow).mode = init.mode;
    $(shadow).nodeDocument = this.#_.nodeDocument;

    // 6. Set shadow’s delegates focus to init["delegatesFocus"].
    $(shadow).delegatesFocus = init.delegatesFocus ?? false;

    const { customElementState } = this.#_;
    // 7. If this’s custom element state is "precustomized" or "custom", then set shadow’s available to element internals to true.
    if (
      customElementState === CustomElementState.Precustomized ||
      customElementState === CustomElementState.Custom
    ) $(shadow).availableElementInternals;

    // 8. Set shadow’s slot assignment to init["slotAssignment"].
    $(shadow).slotAssignment = init.slotAssignment;

    // 9. Set this’s shadow root to shadow.
    this.#_.shadowRoot = shadow;

    // 10 .Return shadow.
    return shadow;
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
      this.#_.attributeList,
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
      this.#_.namespace === Namespace.HTML &&
      isHTMLDocument(this.#_.nodeDocument)
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
      attributeList: this.#_.attributeList,
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
      this.#_.attributeList,
      (attr) =>
        $(attr).namespace === namespace && $(attr).localName === localName,
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-element-hasattributes
   */
  hasAttributes(): boolean {
    // return false if this’s attribute list is empty; otherwise true.
    return !this.#_.attributeList.isEmpty;
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
    const text = new Text();
    // 1. Let text be a new Text node whose data is data and node document is this’s node document.
    $(text).data = data, $(text).nodeDocument = this.#_.nodeDocument;

    // 2. Run insert adjacent, given this, where, and text.
    insertAdjacent(this, where, text);
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
    if (!this.#_.attributeList.contains(attr)) {
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
      this.#_.namespace === Namespace.HTML &&
      isHTMLDocument(this.#_.nodeDocument)
    ) qualifiedName = toASCIILowerCase(qualifiedName);

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is qualifiedName, and null otherwise.
    const attribute = find(
      this.#_.attributeList,
      (attr) => $(attr).qualifiedName === qualifiedName,
    ) ?? null;

    // 4. If attribute is null, create an attribute whose local name is qualifiedName, value is value, and node document is this’s node document, then append this attribute to this, and then return.
    if (attribute === null) {
      const attribute = new Attr({
        localName: qualifiedName,
        value,
        nodeDocument: this.#_.nodeDocument,
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
      this.#_.namespace === Namespace.HTML &&
      isHTMLDocument(this.#_.nodeDocument)
    ) qualifiedName = toASCIILowerCase(qualifiedName);

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is qualifiedName, and null otherwise.
    const attribute = find(
      this.#_.attributeList,
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
          nodeDocument: this.#_.nodeDocument,
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

  /**
   * @see [HTML Living Standard](https://dom.spec.whatwg.org/#dom-element-matches)
   */
  @convert
  matches(@DOMString selectors: string): boolean {
    // 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
    const s = parseSelector(selectors);

    // 2. If s is failure, then throw a "SyntaxError" DOMException.
    if (typeof s === "string") {
      throw new DOMException("<message>", DOMExceptionName.SyntaxError);
    }

    // 3. If the result of match a selector against an element, using s, this, and scoping root this, returns success, then return true; otherwise, return false. [SELECTORS4]
    return matchSelector(s, this, [this]);
  }

  /**
   * @see [HTML Living Standard](https://dom.spec.whatwg.org/#dom-element-webkitmatchesselector)
   */
  webkitMatchesSelector = this.matches;

  get #_() {
    return $<Element>(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
   */
  get #upperQualifiedName(): string {
    // 1. Let qualifiedName be this’s qualified name.
    let qualifiedName = this.#_.qualifiedName;

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set qualifiedName to qualifiedName in ASCII uppercase.
    if (
      this.#_.namespace === Namespace.HTML &&
      $(this.#_.nodeDocument).type !== "xml"
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
  shadowRoot: globalThis.ShadowRoot | null = null;

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

export interface AttributesContext {
  element: globalThis.Element;
  localName: string;
  oldValue: string | null;
  value: string | null;
  namespace: string | null;
}
