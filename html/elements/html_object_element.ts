import type { IHTMLObjectElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLObjectElement")
export class HTMLObjectElement extends HTMLElement
  implements IHTMLObjectElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get archive(): string {
    throw new Error("archive#getter");
  }
  set archive(value: string) {
    throw new Error("archive#setter");
  }

  get border(): string {
    throw new Error("border#getter");
  }
  set border(value: string) {
    throw new Error("border#setter");
  }

  get code(): string {
    throw new Error("code#getter");
  }
  set code(value: string) {
    throw new Error("code#setter");
  }

  get codeBase(): string {
    throw new Error("codeBase#getter");
  }
  set codeBase(value: string) {
    throw new Error("codeBase#setter");
  }

  get codeType(): string {
    throw new Error("codeType#getter");
  }
  set codeType(value: string) {
    throw new Error("codeType#setter");
  }

  get contentDocument(): Document | null {
    throw new Error("contentDocument");
  }

  get contentWindow(): WindowProxy | null {
    throw new Error("contentWindow");
  }

  get data(): string {
    throw new Error("data#getter");
  }
  set data(value: string) {
    throw new Error("data#setter");
  }

  get declare(): boolean {
    throw new Error("declare#getter");
  }
  set declare(value: boolean) {
    throw new Error("declare#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form");
  }

  get height(): string {
    throw new Error("height#getter");
  }
  set height(value: string) {
    throw new Error("height#setter");
  }

  get hspace(): number {
    throw new Error("hspace#getter");
  }
  set hspace(value: number) {
    throw new Error("hspace#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get standby(): string {
    throw new Error("standby#getter");
  }
  set standby(value: string) {
    throw new Error("standby#setter");
  }

  get type(): string {
    throw new Error("type#getter");
  }
  set type(value: string) {
    throw new Error("type#setter");
  }

  get useMap(): string {
    throw new Error("useMap#getter");
  }
  set useMap(value: string) {
    throw new Error("useMap#setter");
  }

  get validationMessage(): string {
    throw new Error("validationMessage");
  }

  get validity(): ValidityState {
    throw new Error("validity");
  }

  get vspace(): number {
    throw new Error("vspace#getter");
  }
  set vspace(value: number) {
    throw new Error("vspace#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }

  get willValidate(): boolean {
    throw new Error("willValidate");
  }

  checkValidity(): boolean {
    throw new Error("checkValidity");
  }

  getSVGDocument(): Document | null {
    throw new Error("getSVGDocument");
  }

  reportValidity(): boolean {
    throw new Error("reportValidity");
  }

  setCustomValidity(error: string): void {
    throw new Error("setCustomValidity");
  }
}
