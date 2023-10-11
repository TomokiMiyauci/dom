import type { IHTMLFrameElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLFrameElement")
export class HTMLFrameElement extends HTMLElement implements IHTMLFrameElement {
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
  get noResize(): boolean {
    throw new Error("noResize#getter");
  }
  set noResize(value: boolean) {
    throw new Error("noResize#setter");
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
}
