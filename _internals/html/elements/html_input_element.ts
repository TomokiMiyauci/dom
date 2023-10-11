import type { IHTMLInputElement } from "../../interface.d.ts";
import { HTMLElement } from "../dom/html_element.ts";
import { reflectGet, reflectSet } from "../infra/common_dom_interface.ts";
import { $, internalSlots } from "../../../internal.ts";
import { isConnected } from "../../../nodes/node_tree.ts";
import { fireEvent } from "../../../events/fire.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed("Window", "HTMLInputElement")
export class HTMLInputElement extends HTMLElement implements IHTMLInputElement {
  constructor() {
    super();

    internalSlots.extends<HTMLInputElement>(
      this,
      new HTMLInputElementInternals(),
    );

    this.#_.activationBehavior = (event) => {
      // 1. If element is not mutable and is not in the Checkbox state and is not in the Radio state, then return.

      // 2. Run element's input activation behavior, if any, and do nothing otherwise.
      this.#_["feature"]?.inputActivationBehavior?.(this);

      // 3. Run the popover target attribute activation behavior on element.
    };

    const before = {
      checkness: this.#_.checkedness,
      indeterminate: this.indeterminate,
    };

    this.#_.legacyPreActivationBehavior = () => {
      // 1. If this element's type attribute is in the Checkbox state, then set this element's checkedness to its opposite value (i.e. true if it is false, false if it is true) and set this element's indeterminate IDL attribute to false.
      if (this.type === "checkbox") {
        before.checkness = this.#_.checkedness,
          before.indeterminate = this.indeterminate;

        this.#_.checkedness = !this.#_.checkedness, this.indeterminate = false;
      }

      // 2. If this element's type attribute is in the Radio Button state, then get a reference to the element in this element's radio button group that has its checkedness set to true, if any, and then set this element's checkedness to true.
      // TODO
      if (this.type === "radio") {
        before.checkness = this.#_.checkedness;
        this.#_.checkedness = true;
      }
    };

    this.#_.legacyCanceledActivation = () => {
      // 1. If the element's type attribute is in the Checkbox state,
      if (this.type === "checkbox") {
        // then set the element's checkedness and the element's indeterminate IDL attribute back to the values they had before the legacy-pre-activation behavior was run.
        this.#_.checkedness = before.checkness,
          this.#_.indeterminate = before.indeterminate;
      }

      // 2. If this element's type attribute is in the Radio Button state,
      if (this.type === "radio") {
        // then if the element to which a reference was obtained in the legacy-pre-activation behavior, if any, is still in what is now this element's radio button group, if it still has one, and if so, setting that element's checkedness to true; or else, if there was no such element, or that element is no longer in this element's radio button group, or if this element no longer has a radio button group, setting this element's checkedness to false.
        // TODO
        this.#_.checkedness = false;
      }
    };
  }

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

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-checked)
   */
  get checked(): boolean {
    // return the current checkedness of the element;
    return this.#_.checkedness;
  }
  set checked(value: boolean) {
    // set the element's checkedness to the new value and set the element's dirty checkedness flag to true.
    this.#_.checkedness = value, this.#_.dirtyCheckednessFlag = true;
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

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#dom-input-indeterminate)
   */
  get indeterminate(): boolean {
    return this.#_.indeterminate;
  }
  set indeterminate(value: boolean) {
    this.#_.indeterminate = value;
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
    const previous = this.type;
    reflectSet(this, "type", value);

    if (inputmap.has(value)) {
      $<HTMLInputElement>(this)["feature"] = inputmap.get(value)!;
    }

    onChangeType(value, previous, this);
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

  get #_() {
    return internalSlots.get<HTMLInputElement>(this);
  }

  #reflectGet() {
  }

  #reflectSet(content: ContentAttribute, value: string | boolean) {
    if (this.state.applicableContentAttributes.has(content)) {
      reflectSet(this, content, value);
    }
  }

  private state: State = resolveState("");
}

function onChangeType(
  current: string,
  previous: string,
  element: HTMLInputElement,
): void {
  const previousState = resolveState(previous),
    newState = resolveState(current);
  // 1. If the previous state of the element's type attribute put the value IDL attribute in the value mode, and the element's value is not the empty string, and the new state of the element's type attribute puts the value IDL attribute in either the default mode or the default/on mode,
  if (
    previousState.valueIDL === ValueIDL.Value && $(element).value !== "" &&
    [ValueIDL.Default, ValueIDL.DefaultOn].includes(newState.valueIDL)
    // then set the element's value content attribute to the element's value.
  ) element.value = $(element).value;
  // 2. Otherwise, if the previous state of the element's type attribute put the value IDL attribute in any mode other than the value mode, and the new state of the element's type attribute puts the value IDL attribute in the value mode,
  else if (
    previousState.valueIDL !== ValueIDL.Value &&
    newState.valueIDL === ValueIDL.Value
  ) {
    // then set the value of the element to the value of the value content attribute, if there is one, or the empty string otherwise, and then set the control's dirty value flag to false.
    $(element).value = element.value, $(element).dirtyValueFlag = false;
    // 3. Otherwise, if the previous state of the element's type attribute put the value IDL attribute in any mode other than the filename mode, and the new state of the element's type attribute puts the value IDL attribute in the filename mode,
  } else if (
    previousState.valueIDL !== ValueIDL.Filename &&
    newState.valueIDL === ValueIDL.Filename
  ) {
    // then set the value of the element to the empty string.
    $(element).value = "";
  }

  // 4. Update the element's rendering and behavior to the new state's.
  element["state"] = newState;

  // 5. Signal a type change for the element. (The Radio Button state uses this, in particular.)

  // 6. Invoke the value sanitization algorithm, if one is defined for the type attribute's new state.
  // newState.valueSanitizationAlgorithm?.();

  // 7. Let previouslySelectable be true if setRangeText() previously applied to the element, and false otherwise.

  // 8. Let nowSelectable be true if setRangeText() now applies to the element, and false otherwise.

  // 9. If previouslySelectable is false and nowSelectable is true, set the element's text entry cursor position to the beginning of the text control, and set its selection direction to "none".
}

export class HTMLInputElementInternals {
  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#concept-input-checked-dirty-flag)
   */
  dirtyCheckednessFlag = false;

  value = "";
  checkedness = false;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-dirty)
   */
  dirtyValueFlag = false;

  indeterminate = false;

  formOwner: HTMLFormElement | null = null;

  private feature?: InputFeature;
}

function resolveState(type: string): State {
  return textState;
}

enum ValueIDL {
  Value = "value",
  Default = "default",
  DefaultOn = "default/on",
  Filename = "filename",
}

const textState: State = {
  valueIDL: ValueIDL.Value,
  applicableContentAttributes: new Set<ContentAttribute>([
    "autocomplete",
    "dirname",
    "list",
    "maxlength",
    "minlength",
    "pattern",
    "placeholder",
    "readonly",
    "required",
    "size",
  ]),
};

interface State {
  valueIDL: ValueIDL;

  applicableContentAttributes: Set<ContentAttribute>;

  valueSanitizationAlgorithm?(value: string): string;

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html#concept-input-value-string-number)
   */
  convertStringToNumber?(): number;

  convertNumberToString?(): string;

  convertStringToDate?(): Date;

  convertDateToString?(): string;
}

const stateMap: Map<string, State> = new Map();

type ContentAttribute =
  | "accept"
  | "alt"
  | "autocomplete"
  | "checked"
  | "dirname"
  | "formaction"
  | "formenctype"
  | "formmethod"
  | "formnovalidate"
  | "formtarget"
  | "height"
  | "list"
  | "max"
  | "maxlength"
  | "min"
  | "minlength"
  | "multiple"
  | "pattern"
  | "placeholder"
  | "popovertarget"
  | "popovertargetaction"
  | "readonly"
  | "required"
  | "size"
  | "src"
  | "step"
  | "width";

interface InputFeature {
  inputActivationBehavior?(element: Element): void;
}

const checkbox: InputFeature = {
  inputActivationBehavior(element: Element): void {
    // 1. If the element is not connected, then return.
    if (!isConnected(element)) return;

    // 2. Fire an event named input at the element with the bubbles and composed attributes initialized to true.
    fireEvent("input", element, undefined, (event) => {
      $(event).bubbles = true, $(event).composed = true;
    });

    // 3. Fire an event named change at the element with the bubbles attribute initialized to true.
    fireEvent("change", element, undefined, (event) => $(event).bubbles = true);
  },
};

const radio: InputFeature = {
  inputActivationBehavior(element): void {
    // 1. If the element is not connected, then return.
    if (!isConnected(element)) return;

    // 2. Fire an event named input at the element with the bubbles and composed attributes initialized to true.
    fireEvent("input", element, undefined, (event) => {
      $(event).bubbles = true, $(event).composed = true;
    });

    // 3. Fire an event named change at the element with the bubbles attribute initialized to true.
    fireEvent("change", element, undefined, (event) => $(event).bubbles = true);
  },
};

const inputmap = new Map<string, InputFeature>([
  ["checkbox", checkbox],
  ["radio", radio],
]);
