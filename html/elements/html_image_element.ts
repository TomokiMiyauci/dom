import type { IHTMLImageElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLImageElement extends HTMLElement implements IHTMLImageElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }
  get alt(): string {
    throw new Error("alt#getter");
  }
  set alt(value: string) {
    throw new Error("alt#setter");
  }
  get border(): string {
    throw new Error("border#getter");
  }
  set border(value: string) {
    throw new Error("border#setter");
  }
  get complete(): boolean {
    throw new Error("complete");
  }
  get crossOrigin(): string | null {
    throw new Error("crossOrigin#getter");
  }
  set crossOrigin(value: string | null) {
    throw new Error("crossOrigin#setter");
  }
  get currentSrc(): string {
    throw new Error("currentSrc");
  }
  get decoding(): "async" | "sync" | "auto" {
    throw new Error("decoding#getter");
  }
  set decoding(value: "async" | "sync" | "auto") {
    throw new Error("decoding#setter");
  }
  get height(): number {
    throw new Error("height#getter");
  }
  set height(value: number) {
    throw new Error("height#setter");
  }
  get hspace(): number {
    throw new Error("hspace#getter");
  }
  set hspace(value: number) {
    throw new Error("hspace#setter");
  }
  get isMap(): boolean {
    throw new Error("isMap#getter");
  }
  set isMap(value: boolean) {
    throw new Error("isMap#setter");
  }
  get loading(): "eager" | "lazy" {
    throw new Error("loading#getter");
  }
  set loading(value: "eager" | "lazy") {
    throw new Error("loading#setter");
  }
  get longDesc(): string {
    throw new Error("longDesc#getter");
  }
  set longDesc(value: string) {
    throw new Error("longDesc#setter");
  }
  get lowsrc(): string {
    throw new Error("lowsrc#getter");
  }
  set lowsrc(value: string) {
    throw new Error("lowsrc#setter");
  }
  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }
  get naturalHeight(): number {
    throw new Error("naturalHeight");
  }
  get naturalWidth(): number {
    throw new Error("naturalWidth");
  }
  get referrerPolicy(): string {
    throw new Error("referrerPolicy#getter");
  }
  set referrerPolicy(value: string) {
    throw new Error("referrerPolicy#setter");
  }
  get sizes(): string {
    throw new Error("sizes#getter");
  }
  set sizes(value: string) {
    throw new Error("sizes#setter");
  }
  get src(): string {
    throw new Error("src#getter");
  }
  set src(value: string) {
    throw new Error("src#setter");
  }
  get srcset(): string {
    throw new Error("srcset#getter");
  }
  set srcset(value: string) {
    throw new Error("srcset#setter");
  }
  get useMap(): string {
    throw new Error("useMap#getter");
  }
  set useMap(value: string) {
    throw new Error("useMap#setter");
  }
  get vspace(): number {
    throw new Error("vspace#getter");
  }
  set vspace(value: number) {
    throw new Error("vspace#setter");
  }
  get width(): number {
    throw new Error("width#getter");
  }
  set width(value: number) {
    throw new Error("width#setter");
  }
  get x(): number {
    throw new Error("x");
  }
  get y(): number {
    throw new Error("y");
  }
  decode(): Promise<void> {
    throw new Error("decode");
  }
}
