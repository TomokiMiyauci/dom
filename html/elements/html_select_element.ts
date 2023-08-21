import type { IHTMLSelectElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLSelectElement extends HTMLElement
  implements IHTMLSelectElement {
  [name: number]: HTMLOptionElement | HTMLOptGroupElement;

  get autocomplete(): string {
    throw new Error("autocomplete#getter");
  }
  set autocomplete(value: string) {
    throw new Error("autocomplete#setter");
  }

  get disabled(): boolean {
    throw new Error("disabled#getter");
  }
  set disabled(value: boolean) {
    throw new Error("disabled#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form");
  }

  get labels(): NodeListOf<HTMLLabelElement> {
    throw new Error("labels");
  }

  get length(): number {
    throw new Error("length#getter");
  }
  set length(value: number) {
    throw new Error("length#setter");
  }

  get multiple(): boolean {
    throw new Error("multiple#getter");
  }
  set multiple(value: boolean) {
    throw new Error("multiple#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get options(): HTMLOptionsCollection {
    throw new Error("options");
  }

  get required(): boolean {
    throw new Error("required#getter");
  }
  set required(value: boolean) {
    throw new Error("required#setter");
  }

  get selectedIndex(): number {
    throw new Error("selectedIndex#getter");
  }
  set selectedIndex(value: number) {
    throw new Error("selectedIndex#setter");
  }

  get selectedOptions(): HTMLCollectionOf<HTMLOptionElement> {
    throw new Error("selectedOptions#getter");
  }

  get size(): number {
    throw new Error("size#getter");
  }
  set size(value: number) {
    throw new Error("size#setter");
  }

  get type(): string {
    throw new Error("type");
  }

  get validationMessage(): string {
    throw new Error("validationMessage");
  }

  get validity(): ValidityState {
    throw new Error("validity");
  }

  get value(): string {
    throw new Error("value#getter");
  }
  set value(value: string) {
    throw new Error("value#setter");
  }

  get willValidate(): boolean {
    throw new Error("willValidate");
  }

  add(
    element: HTMLOptionElement | HTMLOptGroupElement,
    before?: HTMLElement | number | null,
  ): void {
    throw new Error("add");
  }

  checkValidity(): boolean {
    throw new Error("checkValidity");
  }

  item(index: number): HTMLOptionElement | null {
    throw new Error("item");
  }

  namedItem(name: string): HTMLOptionElement | null {
    throw new Error("namedItem");
  }

  override remove(index?: number): void {
    throw new Error("remove");
  }

  reportValidity(): boolean {
    throw new Error("reportValidity");
  }

  setCustomValidity(error: string): void {
    throw new Error("setCustomValidity");
  }

  *[Symbol.iterator](): IterableIterator<HTMLOptionElement> {}
}
