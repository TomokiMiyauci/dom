import type { IWindow } from "../../interface.d.ts";
import { EventTarget } from "../../../events/event_target.ts";
import { WindowEventHandlers } from "../window_event_handlers.ts";
import { Document } from "../../../nodes/document.ts";
import { $, internalSlots } from "../../../internal.ts";
import {
  activeWindow,
  Navigable,
  targetName,
} from "./infrastructure_for_sequences_of_documents/navigable.ts";
import { BrowsingContext } from "./infrastructure_for_sequences_of_documents/browsing_context.ts";
import { stopLoading } from "./document_lifecycle.ts";
import { PutForwards } from "../../webidl/extended_attribute.ts";
import { Location } from "./location.ts";
import { LegacyUnenumerableNamedProperties } from "../../webidl/legacy_extended_attributes.ts";
import { map } from "../../webidl/extended_attribute.ts";

// @WindowEventHandlers
// @Window_Selection
// @LegacyUnenumerableNamedProperties
export class Window extends EventTarget implements IWindow {
  constructor(url: URL) {
    super();

    const internals = new WindowInternals();
    $(internals.document).URL = url;
    $(internals.location).document = internals.document;
    internalSlots.extends<globalThis.Window>(
      this as any,
      internals,
    );

    const objects = [...map.entries()].filter(([_, data]) =>
      data.scope === "Window"
    )
      .map(([first, { name }]) => [name, { value: first }] as const);

    const descriptorMap = Object.fromEntries(objects);

    Object.defineProperties(this, descriptorMap);
  }

  get clientInformation(): Navigator {
    throw new Error();
  }

  get closed(): boolean {
    const browsingContext = this.#browsingContext;
    // return true if this's browsing context is null or its is closing is true; otherwise false.
    throw new Error();
  }

  get customElements(): CustomElementRegistry {
    throw new Error();
  }

  get devicePixelRatio(): number {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-2)
   */
  get document(): Document {
    // return this's associated Document.
    return this.#_.document;
  }

  get event(): Event | undefined {
    throw new Error();
  }

  get external(): External {
    throw new Error();
  }

  get frameElement(): Element | null {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-frames)
   */
  get frames(): WindowProxy {
    const iframes = (this.document as Document).querySelectorAll(
      "iframe",
    );

    return [...iframes].map((iframe) => iframe.contentWindow) as any;

    // return this's relevant realm.[[GlobalEnv]].[[GlobalThisValue]].
    return this as any;
  }

  get history(): History {
    throw new Error();
  }

  get innerHeight(): number {
    throw new Error();
  }

  get innerWidth(): number {
    throw new Error();
  }

  get length(): number {
    throw new Error();
  }

  @PutForwards("href")
  get location(): globalThis.Location {
    // return this's Location object.
    return this.#_.location;
  }

  get locationbar(): BarProp {
    throw new Error();
  }
  get menubar(): BarProp {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-name)
   */
  get name(): string {
    // 1. If this's navigable is null, then return the empty string.
    if (!this.#navigable) return "";

    // 2. Return this's navigable's target name.
    return targetName(this.#navigable);
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-name)
   */
  set name(value: string) {
    // 1. If this's navigable is null, then return.
    if (!this.#navigable) return;

    // 2. Set this's navigable's active session history entry's document state's navigable target name to the given value.
    this.#navigable.activeSessionHistoryEntry.documentState
      .navigableTargetName = value;
  }

  get navigator(): Navigator {
    throw new Error();
  }

  get ondevicemotion():
    | ((this: globalThis.Window, ev: DeviceMotionEvent) => any)
    | null {
    throw new Error();
  }
  set ondevicemotion(
    value:
      | ((this: globalThis.Window, ev: DeviceMotionEvent) => any)
      | null,
  ) {
    throw new Error();
  }

  get ondeviceorientation():
    | ((this: globalThis.Window, ev: DeviceOrientationEvent) => any)
    | null {
    throw new Error();
  }
  set ondeviceorientation(
    value:
      | ((this: globalThis.Window, ev: DeviceOrientationEvent) => any)
      | null,
  ) {
    throw new Error();
  }

  get onorientationchange():
    | ((this: globalThis.Window, ev: Event) => any)
    | null {
    throw new Error();
  }
  set onorientationchange(
    value:
      | ((this: globalThis.Window, ev: Event) => any)
      | null,
  ) {
    throw new Error();
  }

  get opener(): any {
    return;
  }
  set opener(value: any) {
    throw new Error();
  }
  get orientation(): number {
    throw new Error();
  }
  get outerHeight(): number {
    throw new Error();
  }
  get outerWidth(): number {
    throw new Error();
  }
  get pageXOffset(): number {
    throw new Error();
  }
  get pageYOffset(): number {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-parent)
   */
  get parent(): WindowProxy {
    return globalThis as any;
    // // 1. Let navigable be this's navigable.
    // const navigable = this.#navigable;

    // // 2. If navigable is null, then return null.
    // if (!navigable) return null!;

    // // 3. If navigable's parent is not null, then set navigable to navigable's parent.
    // if (!navigable.parent) navigable.parent = navigable;

    // // 4. Return navigable's active WindowProxy.
    // return activeWindow(navigable)!;
  }

  get personalbar(): BarProp {
    throw new Error();
  }
  get screen(): Screen {
    throw new Error();
  }
  get screenLeft(): number {
    throw new Error();
  }
  get screenTop(): number {
    throw new Error();
  }
  get screenX(): number {
    throw new Error();
  }
  get screenY(): number {
    throw new Error();
  }
  get scrollX(): number {
    throw new Error();
  }
  get scrollY(): number {
    throw new Error();
  }
  get scrollbars(): BarProp {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-self)
   */
  get self(): globalThis.Window & typeof globalThis {
    return this as any;
  }

  get speechSynthesis(): SpeechSynthesis {
    throw new Error();
  }
  get status(): string {
    throw new Error();
  }
  set status(value: string) {
    throw new Error();
  }
  get statusbar(): BarProp {
    throw new Error();
  }
  get toolbar(): BarProp {
    throw new Error();
  }
  get top(): WindowProxy | null {
    throw new Error();
  }
  get visualViewport(): VisualViewport | null {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-window)
   */
  get window(): globalThis.Window & typeof globalThis {
    return this as any;
  }

  alert(message?: any): void {
    throw new Error();
  }
  blur(): void {
    throw new Error();
  }
  cancelIdleCallback(handle: number): void {
    throw new Error();
  }
  captureEvents(): void {
    throw new Error();
  }
  close(): void {
    throw new Error();
  }
  confirm(message?: string): boolean {
    throw new Error();
  }
  focus(): void {
    throw new Error();
  }
  getComputedStyle(
    elt: Element,
    pseudoElt?: string | null,
  ): CSSStyleDeclaration {
    throw new Error();
  }
  matchMedia(query: string): MediaQueryList {
    throw new Error();
  }
  moveBy(x: number, y: number): void {
    throw new Error();
  }
  moveTo(x: number, y: number): void {
    throw new Error();
  }
  open(
    url?: string | URL,
    target?: string,
    features?: string,
  ): WindowProxy | null {
    throw new Error();
  }
  postMessage(
    message: any,
    targetOrigin: string,
    transfer?: Transferable[],
  ): void;
  postMessage(message: any, options?: WindowPostMessageOptions): void;
  postMessage(message: any, options?: WindowPostMessageOptions | string): void {
    throw new Error();
  }
  print(): void {
    throw new Error();
  }
  prompt(message?: string, _default?: string): string | null {
    throw new Error();
  }
  releaseEvents(): void {
    throw new Error();
  }
  requestIdleCallback(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ): number {
    throw new Error();
  }
  resizeBy(x: number, y: number): void {
    throw new Error();
  }
  resizeTo(width: number, height: number): void {
    throw new Error();
  }
  scroll(options?: ScrollToOptions): void;
  scroll(x: number, y: number): void;
  scroll(x?: number | ScrollToOptions, y?: number): void {
    throw new Error();
  }
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: number | ScrollToOptions, y?: number): void {
    throw new Error();
  }
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: number | ScrollToOptions, y?: number): void {
    throw new Error();
  }

  /**
   * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-window-stop)
   */
  stop(): void {
    const navigable = this.#navigable;
    // 1. If this's navigable is null, then return.
    if (!navigable) return;

    // 2. Stop loading this's navigable.
    stopLoading(navigable);
  }

  [index: number]: globalThis.Window;

  get #_() {
    return $<globalThis.Window>(this as any);
  }

  get #navigable(): Navigable | null {
    return null;
  }

  get #browsingContext(): BrowsingContext | null {
    return browsingContext(this as any);
  }
}

export interface Window extends WindowEventHandlers {
  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export class WindowInternals {
  document: Document = new Document();
  location: Location = new Location();
}

export function browsingContext(
  window: globalThis.Window,
): BrowsingContext | null {
  return $($(window).document).browsingContext;
}

export function navigable(window: globalThis.Window) {
  $(window);
}
