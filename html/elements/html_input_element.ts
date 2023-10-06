import type { IHTMLInputElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { reflectGet, reflectSet } from "../infra/common_dom_interface.ts";

export class HTMLInputElement extends HTMLElement implements IHTMLInputElement {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-accept)
   */
  get accept(): string {
    return reflectGet("DOMString", this, "accept");
  }
  set accept(value: string) {
    reflectSet(this, "accept", value);
  }

  get align(): string {
    throw new Error("align#getter");
  }
  set align(value: string) {
    throw new Error("align#setter");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-alt)
   */
  get alt(): string {
    return reflectGet("DOMString", this, "alt");
  }
  set alt(value: string) {
    reflectSet(this, "alt", value);
  }

  get autocomplete(): AutoFill {
    throw new Error("autocomplete#getter");
  }
  set autocomplete(value: AutoFill) {
    throw new Error("autocomplete#setter");
  }
  get capture(): string {
    throw new Error("capture#getter");
  }
  set capture(value: string) {
    throw new Error("capture#setter");
  }

  get checked(): boolean {
    throw new Error("checked#getter");
  }
  set checked(value: boolean) {
    throw new Error("checked#setter");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-defaultchecked)
   */
  get defaultChecked(): boolean {
    return reflectGet("boolean", this, "checked");
  }
  set defaultChecked(value: boolean) {
    reflectSet(this, "checked", value);
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-defaultvalue)
   */
  get defaultValue(): string {
    return reflectGet("DOMString", this, "value");
  }
  set defaultValue(value: string) {
    reflectSet(this, "value", value);
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-dirname)
   */
  get dirName(): string {
    return reflectGet("DOMString", this, "dirname");
  }
  set dirName(value: string) {
    reflectSet(this, "dirname", value);
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-fe-disabled)
   */
  get disabled(): boolean {
    // reflect the disabled content attribute.
    return reflectGet("boolean", this, "disabled");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-fe-disabled)
   */
  set disabled(value: boolean) {
    // reflect the disabled content attribute.
    reflectSet(this, "disabled", value);
  }

  get files(): FileList | null {
    throw new Error("files#getter");
  }
  set files(value: FileList | null) {
    throw new Error("files#setter");
  }

  get form(): HTMLFormElement | null {
    throw new Error("form");
  }

  get formAction(): string {
    throw new Error("formAction#getter");
  }
  set formAction(value: string) {
    throw new Error("formAction#setter");
  }

  get formEnctype(): string {
    throw new Error("formEnctype#getter");
  }
  set formEnctype(value: string) {
    throw new Error("formEnctype#setter");
  }

  get formMethod(): string {
    throw new Error("formMethod#getter");
  }
  set formMethod(value: string) {
    throw new Error("formMethod#setter");
  }

  get formNoValidate(): boolean {
    throw new Error("formNoValidate#getter");
  }
  set formNoValidate(value: boolean) {
    throw new Error("formNoValidate#setter");
  }

  get formTarget(): string {
    throw new Error("formTarget#getter");
  }
  set formTarget(value: string) {
    throw new Error("formTarget#setter");
  }

  get height(): number {
    throw new Error("height#getter");
  }
  set height(value: number) {
    throw new Error("height#setter");
  }

  get indeterminate(): boolean {
    throw new Error("indeterminate#getter");
  }
  set indeterminate(value: boolean) {
    throw new Error("indeterminate#setter");
  }

  get labels(): NodeListOf<HTMLLabelElement> | null {
    throw new Error("labels#getter");
  }

  get list(): HTMLDataListElement | null {
    throw new Error("list");
  }

  get max(): string {
    return reflectGet("DOMString", this, "max");
  }

  set max(value: string) {
    reflectSet(this, "max", value);
  }

  get maxLength(): number {
    throw new Error("maxLength#getter");
  }
  set maxLength(value: number) {
    throw new Error("maxLength#setter");
  }

  get min(): string {
    return reflectGet("DOMString", this, "min");
  }
  set min(value: string) {
    reflectSet(this, "min", value);
  }

  get minLength(): number {
    throw new Error("minLength#getter");
  }
  set minLength(value: number) {
    throw new Error("minLength#setter");
  }

  get multiple(): boolean {
    return reflectGet("boolean", this, "multiple");
  }

  set multiple(value: boolean) {
    reflectSet(this, "multiple", value);
  }

  get name(): string {
    throw new Error("name#getter");
  }
  set name(value: string) {
    throw new Error("name#setter");
  }

  get pattern(): string {
    return reflectGet("DOMString", this, "pattern");
  }

  set pattern(value: string) {
    reflectSet(this, "pattern", value);
  }

  get placeholder(): string {
    return reflectGet("DOMString", this, "placeholder");
  }
  set placeholder(value: string) {
    reflectSet(this, "placeholder", value);
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-readonly)
   */
  get readOnly(): boolean {
    return reflectGet("boolean", this, "readonly");
  }
  set readOnly(value: boolean) {
    reflectSet(this, "readonly", value);
  }

  get required(): boolean {
    return reflectGet("boolean", this, "required");
  }

  set required(value: boolean) {
    reflectSet(this, "required", value);
  }

  get selectionDirection(): "forward" | "backward" | "none" | null {
    throw new Error("selectionDirection#getter");
  }
  set selectionDirection(value: "forward" | "backward" | "none" | null) {
    throw new Error("selectionDirection#setter");
  }

  get selectionEnd(): number | null {
    throw new Error("selectionEnd#getter");
  }
  set selectionEnd(value: number | null) {
    throw new Error("selectionEnd#setter");
  }

  get selectionStart(): number | null {
    throw new Error("selectionStart#getter");
  }
  set selectionStart(value: number | null) {
    throw new Error("selectionStart#setter");
  }
  get size(): number {
    throw new Error("size#getter");
  }
  set size(value: number) {
    throw new Error("size#setter");
  }

  get src(): string {
    throw new Error("src#getter");
  }
  set src(value: string) {
    throw new Error("src#setter");
  }

  get step(): string {
    throw new Error("step#getter");
  }
  set step(value: string) {
    throw new Error("step#setter");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-type)
   */
  get type(): string {
    //  reflect the respective content attribute of the same name, limited to only known values.
    return reflectGet("DOMString", this, "type");
  }
  set type(value: string) {
    reflectSet(this, "type", value);
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

  get value(): string {
    throw new Error("value#getter");
  }
  set value(value: string) {
    throw new Error("value#setter");
  }

  get valueAsDate(): Date | null {
    throw new Error("valueAsDate#getter");
  }
  set valueAsDate(value: Date | null) {
    throw new Error("valueAsDate#setter");
  }

  get valueAsNumber(): number {
    throw new Error("valueAsNumber#getter");
  }
  set valueAsNumber(value: number) {
    throw new Error("valueAsNumber#setter");
  }

  get webkitEntries(): ReadonlyArray<FileSystemEntry> {
    throw new Error("webkitEntries#getter");
  }

  get webkitdirectory(): boolean {
    throw new Error("webkitdirectory#getter");
  }
  set webkitdirectory(value: boolean) {
    throw new Error("webkitdirectory#setter");
  }

  get width(): number {
    throw new Error("width#getter");
  }
  set width(value: number) {
    throw new Error("width#setter");
  }

  get willValidate(): boolean {
    throw new Error("willValidate");
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

  showPicker(): void {
    throw new Error("showPicker");
  }

  stepDown(n?: number): void {
    throw new Error("stepDown");
  }

  stepUp(n?: number): void {
    throw new Error("stepUp");
  }
}
