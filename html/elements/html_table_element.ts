import type { IHTMLTableElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";

export class HTMLTableElement extends HTMLElement implements IHTMLTableElement {
  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  get bgColor(): string {
    throw new Error("bgColor#getter");
  }
  set bgColor(value: string) {
    throw new Error("bgColor#setter");
  }

  get border(): string {
    throw new Error("border#getter");
  }
  set border(value: string) {
    throw new Error("border#setter");
  }

  get caption(): HTMLTableCaptionElement | null {
    throw new Error("caption#getter");
  }
  set caption(value: HTMLTableCaptionElement | null) {
    throw new Error("caption#setter");
  }

  get cellPadding(): string {
    throw new Error("cellPadding#getter");
  }
  set cellPadding(value: string) {
    throw new Error("cellPadding#setter");
  }

  get cellSpacing(): string {
    throw new Error("cellSpacing#getter");
  }
  set cellSpacing(value: string) {
    throw new Error("cellSpacing#setter");
  }

  get frame(): string {
    throw new Error("frame#getter");
  }
  set frame(value: string) {
    throw new Error("frame#setter");
  }

  get rows(): HTMLCollectionOf<HTMLTableRowElement> {
    throw new Error("rows#getter");
  }

  get rules(): string {
    throw new Error("rules#getter");
  }
  set rules(value: string) {
    throw new Error("rules#setter");
  }

  get summary(): string {
    throw new Error("summary#getter");
  }
  set summary(value: string) {
    throw new Error("summary#setter");
  }

  get tBodies(): HTMLCollectionOf<HTMLTableSectionElement> {
    throw new Error("tBodies#getter");
  }

  get tFoot(): HTMLTableSectionElement | null {
    throw new Error("tFoot#getter");
  }
  set tFoot(value: HTMLTableSectionElement | null) {
    throw new Error("tFoot#setter");
  }

  get tHead(): HTMLTableSectionElement | null {
    throw new Error("tHead#getter");
  }
  set tHead(value: HTMLTableSectionElement | null) {
    throw new Error("tHead#setter");
  }

  get width(): string {
    throw new Error("width#getter");
  }
  set width(value: string) {
    throw new Error("width#setter");
  }

  createCaption(): HTMLTableCaptionElement {
    throw new Error("createCaption");
  }

  createTBody(): HTMLTableSectionElement {
    throw new Error("createTBody");
  }

  createTFoot(): HTMLTableSectionElement {
    throw new Error("createTFoot");
  }

  createTHead(): HTMLTableSectionElement {
    throw new Error("createTHead");
  }

  deleteCaption(): void {
    throw new Error("deleteCaption");
  }

  deleteRow(index: number): void {
    throw new Error("deleteRow");
  }

  deleteTFoot(): void {
    throw new Error("deleteTFoot");
  }

  deleteTHead(): void {
    throw new Error("deleteTHead");
  }

  insertRow(index?: number): HTMLTableRowElement {
    throw new Error("insertRow");
  }
}
