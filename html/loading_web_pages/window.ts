import type { IWindow } from "../../interface.d.ts";
import { EventTarget } from "../../dom/events/event_target.ts";
import { GlobalEventHandlers } from "../global_event_handlers.ts";
import { WindowEventHandlers } from "../window_event_handlers.ts";

@GlobalEventHandlers
@WindowEventHandlers
export class Window extends EventTarget implements IWindow {
  get clientInformation(): Navigator {
    throw new Error();
  }
  get closed(): boolean {
    throw new Error();
  }
  get customElements(): CustomElementRegistry {
    throw new Error();
  }
  get devicePixelRatio(): number {
    throw new Error();
  }
  get document(): Document {
    throw new Error();
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
  get frames(): WindowProxy {
    throw new Error();
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
  get location(): Location {
    throw new Error();
  }
  set location(href: string | Location) {
    throw new Error();
  }
  get locationbar(): BarProp {
    throw new Error();
  }
  get menubar(): BarProp {
    throw new Error();
  }
  get name(): string {
    throw new Error();
  }
  set name(value: unknown) {
    throw new Error();
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
    throw new Error();
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
  get parent(): WindowProxy {
    throw new Error();
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
  get self(): globalThis.Window & typeof globalThis {
    throw new Error();
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
  get window(): globalThis.Window & typeof globalThis {
    throw new Error();
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
  getSelection(): Selection | null {
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
  stop(): void {
    throw new Error();
  }

  [index: number]: globalThis.Window;
}

export interface Window extends GlobalEventHandlers, WindowEventHandlers {
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
