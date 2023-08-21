import type { IHTMLIFrameElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLIFrameElement extends HTMLElement
  implements IHTMLIFrameElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
  get allow(): string {
    throw new Error("allow#getter");
  }
  set allow(value: string) {
    throw new Error("allow#setter");
  }
  get allowFullscreen(): boolean {
    throw new Error("allowFullscreen#getter");
  }
  set allowFullscreen(value: boolean) {
    throw new Error("allowFullscreen#setter");
  }

  get contentDocument(): Document | null {
    throw new Error("contentDocument");
  }

  get contentWindow(): WindowProxy | null {
    throw new Error("contentWindow");
  }

  get frameBorder(): string {
    throw new Error("frameBorder#getter");
  }
  set frameBorder(value: string) {
    throw new Error("frameBorder#setter");
  }

  get height(): string {
    throw new Error("height#getter");
  }
  set height(value: string) {
    throw new Error("height#setter");
  }
  get loading(): string {
    throw new Error("loading#getter");
  }
  set loading(value: string) {
    throw new Error("loading#setter");
  }

  get longDesc(): string {
    throw new Error("longDesc#getter");
  }
  set longDesc(value: string) {
    throw new Error("longDesc#setter");
  }

  get marginHeight(): string {
    throw new Error("marginHeight#getter");
  }
  set marginHeight(value: string) {
    throw new Error("marginHeight#setter");
  }

  get marginWidth(): string {
    throw new Error("marginWidth#getter");
  }
  set marginWidth(value: string) {
    throw new Error("marginWidth#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get referrerPolicy(): ReferrerPolicy {
    throw new Error("referrerPolicy#getter");
  }
  set referrerPolicy(value: ReferrerPolicy) {
    throw new Error("referrerPolicy#setter");
  }
  get sandbox(): DOMTokenList {
    throw new Error("sandbox");
  }

  get scrolling(): string {
    throw new Error("scrolling#getter");
  }
  set scrolling(value: string) {
    throw new Error("scrolling#setter");
  }

  get src(): string {
    throw new Error("src#getter");
  }
  set src(value: string) {
    throw new Error("src#setter");
  }

  get srcdoc(): string {
    throw new Error("srcdoc#getter");
  }
  set srcdoc(value: string) {
    throw new Error("srcdoc#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }
  getSVGDocument(): Document | null {
    throw new Error("getSVGDocument");
  }
}
