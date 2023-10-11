// deno-lint-ignore-file no-explicit-any
import { Element } from "../../../nodes/elements/element.ts";
import { fireSyntheticPointerEvent } from "../global_event_handlers_utils.ts";
import { ElementContentEditable } from "../element_content_editable.ts";
import { HTMLOrSVGElement } from "./html_or_svg_element.ts";
import { HTMLElement_CSSOMView } from "../../cssom/html_element.ts";
import { ElementCSSInlineStyle } from "../../cssom/element_css_inline_style.ts";
import type { IHTMLElement } from "../../../interface.d.ts";
import { $ } from "../../../internal.ts";
import {
  isDisabled,
  isFormAssociatedElement,
  resetFormOwner,
} from "../elements/forms/attributes_common_to_form_control.ts";
import { isElement } from "../../../nodes/utils.ts";
import { isHTMLElement } from "../utils.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@ElementContentEditable
@HTMLOrSVGElement
@ElementCSSInlineStyle
@HTMLElement_CSSOMView
@Exposed("Window", "HTMLElement")
export class HTMLElement extends Element implements IHTMLElement {
  constructor() {
    super();

    $<HTMLElement>(this).insertionSteps.define((insertedNode) => {
      // 1. If insertedNode is an element whose namespace is the HTML namespace, and this standard defines HTML element insertion steps for insertedNode's local name, then run the corresponding HTML element insertion steps given insertedNode.

      // 2. If insertedNode is a form-associated element or the ancestor of a form-associated element, then:
      if (
        isElement(insertedNode) && isHTMLElement(insertedNode) &&
        isFormAssociatedElement(insertedNode)
      ) {
        // 1. If the form-associated element's parser inserted flag is set, then return.

        // 2 Reset the form owner of the form-associated element.
        resetFormOwner(insertedNode);
      }
    });
  }
  get title(): string {
    throw new Error("title#getter");
  }

  set title(value: string) {
    throw new Error("title#setter");
  }

  get lang(): string {
    throw new Error("lang#getter");
  }

  set lang(value: string) {
    throw new Error("lang#setter");
  }

  get translate(): boolean {
    throw new Error("translate#getter");
  }

  set translate(value: boolean) {
    throw new Error("translate#setter");
  }

  get dir(): string {
    throw new Error("dir#getter");
  }

  set dir(value: string) {
    throw new Error("dir#setter");
  }

  get hidden(): boolean {
    throw new Error("hidden#getter");
  }

  set hidden(value: boolean) {
    throw new Error("hidden#setter");
  }

  get inert(): boolean {
    throw new Error("inert#getter");
  }

  set inert(value: boolean) {
    throw new Error("inert#setter");
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html#dom-click)
   */
  click(): void {
    // 1. If this element is a form control that is disabled, then return.
    if (isDisabled(this)) return;

    // 2. If this element's click in progress flag is set, then return.
    if ($<Element>(this).clickInProgress) return;

    // 3. Set this element's click in progress flag.
    $<Element>(this).clickInProgress = true;

    // 4. Fire a synthetic pointer event named click at this element, with the not trusted flag set.
    fireSyntheticPointerEvent("click", this, true);

    // 5. Unset this element's click in progress flag.
    $<Element>(this).clickInProgress = false;
  }

  get accessKey(): string {
    throw new Error("accessKey#getter");
  }

  set accessKey(value: string) {
    throw new Error("accessKey#setter");
  }

  get accessKeyLabel(): string {
    throw new Error("accessKeyLabel#getter");
  }

  get draggable(): boolean {
    throw new Error("draggable#getter");
  }

  set draggable(value: boolean) {
    throw new Error("draggable#setter");
  }

  get spellcheck(): boolean {
    throw new Error("spellcheck#getter");
  }

  set spellcheck(value: boolean) {
    throw new Error("spellcheck#setter");
  }

  get autocapitalize(): string {
    throw new Error("autocapitalize#getter");
  }

  set autocapitalize(value: string) {
    throw new Error("autocapitalize#setter");
  }

  get innerText(): string {
    throw new Error("innerText#getter");
  }

  set innerText(value: string) {
    throw new Error("innerText#setter");
  }

  get outerText(): string {
    throw new Error("outerText#getter");
  }

  set outerText(value: string) {
    throw new Error("outerText#setter");
  }

  attachInternals(): ElementInternals {
    throw new Error("attachInternals");
  }

  get popover(): string | null {
    throw new Error("popover#getter");
  }

  set popover(value: string | null) {
    throw new Error("popover#setter");
  }

  hidePopover(): void {
    throw new Error("hidePopover");
  }

  showPopover(): void {
    throw new Error("showPopover");
  }

  togglePopover(force?: boolean): void {
    throw new Error("togglePopover");
  }

  get popoverTargetAction(): string {
    throw new Error("popoverTargetAction#getter");
  }

  set popoverTargetAction(value: string) {
    throw new Error("popoverTargetAction#setter");
  }

  get popoverTargetElement(): Element | null {
    throw new Error("popoverTargetElement#getter");
  }

  set popoverTargetElement(value: Element | null) {
    throw new Error("popoverTargetElement#setter");
  }
}

export interface HTMLElement
  extends
    ElementContentEditable,
    HTMLOrSVGElement,
    ElementCSSInlineStyle,
    HTMLElement_CSSOMView {
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
