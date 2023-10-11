import type { IHTMLFormElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLFormElement")
export class HTMLFormElement extends HTMLElement implements IHTMLFormElement {
  [index: number]: Element;
  [name: string]: any;

  get acceptCharset(): string {
    throw new Error("acceptCharset#getter");
  }
  set acceptCharset(value: string) {
    throw new Error("acceptCharset#setter");
  }

  get action(): string {
    throw new Error("action#getter");
  }
  set action(value: string) {
    throw new Error("action#setter");
  }

  get autocomplete(): AutoFillBase {
    throw new Error("autocomplete#getter");
  }
  set autocomplete(value: AutoFillBase) {
    throw new Error("autocomplete#setter");
  }

  get elements(): HTMLFormControlsCollection {
    throw new Error("elements");
  }

  get encoding(): string {
    throw new Error("encoding#getter");
  }
  set encoding(value: string) {
    throw new Error("encoding#setter");
  }

  get enctype(): string {
    throw new Error("enctype#getter");
  }
  set enctype(value: string) {
    throw new Error("enctype#setter");
  }

  get length(): number {
    throw new Error("length");
  }

  get method(): string {
    throw new Error("method#getter");
  }
  set method(value: string) {
    throw new Error("method#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get noValidate(): boolean {
    throw new Error("noValidate#getter");
  }
  set noValidate(value: boolean) {
    throw new Error("noValidate#setter");
  }
  get rel(): string {
    throw new Error("rel#getter");
  }
  set rel(value: string) {
    throw new Error("rel#setter");
  }
  get relList(): DOMTokenList {
    throw new Error("relList");
  }

  get target(): string {
    throw new Error("target#getter");
  }
  set target(value: string) {
    throw new Error("target#setter");
  }

  checkValidity(): boolean {
    throw new Error("checkValidity");
  }

  reportValidity(): boolean {
    throw new Error("reportValidity");
  }

  requestSubmit(submitter?: HTMLElement | null): void {
    throw new Error("requestSubmit");
  }

  reset(): void {
    throw new Error("reset");
  }

  submit(): void {
    throw new Error("submit");
  }

  *[Symbol.iterator](): IterableIterator<Element> {
    throw new Error("iterator");
  }
}
