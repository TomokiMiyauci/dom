import type { IHTMLTextAreaElement } from "../../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLTextAreaElement")
export class HTMLTextAreaElement extends HTMLElement
  implements IHTMLTextAreaElement {
  get autocomplete(): AutoFillBase {
    throw new Error("autocomplete#getter");
  }
  set autocomplete(value: AutoFillBase) {
    throw new Error("autocomplete#setter");
  }

  get cols(): number {
    throw new Error("cols#getter");
  }
  set cols(value: number) {
    throw new Error("cols#setter");
  }

  get defaultValue(): string {
    throw new Error("defaultValue#getter");
  }
  set defaultValue(value: string) {
    throw new Error("defaultValue#setter");
  }
  get dirName(): string {
    throw new Error("dirName#getter");
  }
  set dirName(value: string) {
    throw new Error("dirName#setter");
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

  get maxLength(): number {
    throw new Error("maxLength#getter");
  }
  set maxLength(value: number) {
    throw new Error("maxLength#setter");
  }
  get minLength(): number {
    throw new Error("minLength#getter");
  }
  set minLength(value: number) {
    throw new Error("minLength#setter");
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get placeholder(): string {
    throw new Error("placeholder#getter");
  }
  set placeholder(value: string) {
    throw new Error("placeholder#setter");
  }

  get readOnly(): boolean {
    throw new Error("readOnly#getter");
  }
  set readOnly(value: boolean) {
    throw new Error("readOnly#setter");
  }

  get required(): boolean {
    throw new Error("required#getter");
  }
  set required(value: boolean) {
    throw new Error("required#setter");
  }

  get rows(): number {
    throw new Error("rows#getter");
  }
  set rows(value: number) {
    throw new Error("rows#setter");
  }

  get selectionDirection(): "forward" | "backward" | "none" {
    throw new Error("selectionDirection#getter");
  }
  set selectionDirection(value: "forward" | "backward" | "none") {
    throw new Error("selectionDirection#setter");
  }

  get selectionEnd(): number {
    throw new Error("selectionEnd#getter");
  }
  set selectionEnd(value: number) {
    throw new Error("selectionEnd#setter");
  }

  get selectionStart(): number {
    throw new Error("selectionStart#getter");
  }
  set selectionStart(value: number) {
    throw new Error("selectionStart#setter");
  }

  get textLength(): number {
    throw new Error("textLength");
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

  get wrap(): string {
    throw new Error("wrap#getter");
  }
  set wrap(value: string) {
    throw new Error("wrap#setter");
  }

  checkValidity(): boolean {
    throw new Error("checkValidity");
  }

  reportValidity(): boolean {
    throw new Error("reportValidity");
  }

  select(): void {
    throw new Error("select");
  }

  setCustomValidity(error: string): void {
    throw new Error("setCustomValidity");
  }
  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode,
  ): void;
  setRangeText(
    replacement: string,
    start?: number,
    end?: number,
    selectionMode?: SelectionMode,
  ): void {
    throw new Error("setRangeText");
  }

  setSelectionRange(
    start: number | null,
    end: number | null,
    direction?: "forward" | "backward" | "none",
  ): void {
    throw new Error("setSelectionRange");
  }
}
