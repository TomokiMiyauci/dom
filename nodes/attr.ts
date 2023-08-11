import { Node, NodeType } from "./node.ts";
import { UnImplemented } from "./utils.ts";
import { Document } from "./document.ts";
import { type Element } from "./element.ts";
import type { IAttr } from "../interface.d.ts";

export class Attr extends Node implements IAttr {
  #namespace: string | null;
  #namespacePrefix: string | null;
  #localName: string;
  #value: string;
  #attributeElement: null | Element;

  constructor(localName: string) {
    super();

    this.#namespace = null;
    this.#namespacePrefix = null;
    this.#attributeElement = null;
    this.#value = "";
    this.#localName = localName;
    this.name = "";
  }

  override nodeDocument: Document = new Document();

  override get nodeName(): string {
    const prefix = this.#namespacePrefix;
    const qualifiedName = prefix === null
      ? this.#localName
      : `${prefix}:${this.#localName}`;

    return qualifiedName;
  }

  override get nodeValue(): string | null {
    throw new UnImplemented();
  }

  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  override get textContent(): string | null {
    throw new UnImplemented();
  }
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  get namespaceURI(): string | null {
    return this.#namespace;
  }

  get prefix(): string | null {
    return this.#namespacePrefix;
  }

  get localName(): string {
    return this.#localName;
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    setAnExistingAttributeValue(this, value);
  }

  get ownerElement(): any | null {
    return this.#attributeElement;
  }

  get specified(): boolean {
    return true;
  }

  name: string;
}

function appendAttributes(attribute: Attr, element: Element) {
  element.attributes.setNamedItem(attribute);
  attribute.ownerElement = element;
}

export function setAnExistingAttributeValue(attribute: Attr, value: string) {
  if (attribute.ownerElement === null) {
    attribute.value = value;
  } else {
    changeAttributes(attribute, value);
  }
}

export function changeAttributes(attribute: Attr, value: string): void {
  const oldValue = attribute.value;
  attribute.value = value;

  handleAttributesChanges(attribute, attribute.ownerElement, oldValue, value);
}

export function handleAttributesChanges(
  attribute: Attr,
  element: Element,
  oldValue: Attr,
  newValue: Attr,
): void {
}
