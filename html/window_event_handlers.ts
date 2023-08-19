import { type Constructor } from "../deps.ts";
import type { IWindowEventHandlers } from "../interface.d.ts";

export function WindowEventHandlers<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor
    implements
      Omit<IWindowEventHandlers, "addEventListener" | "removeEventListener"> {
    get onafterprint(): ((this: WindowEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }

    set onafterprint(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get onbeforeprint():
      | ((this: WindowEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }

    set onbeforeprint(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get onbeforeunload():
      | ((this: WindowEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }

    set onbeforeunload(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get onhashchange():
      | ((this: WindowEventHandlers, ev: HashChangeEvent) => any)
      | null {
      throw new Error();
    }

    set onhashchange(
      value: ((this: WindowEventHandlers, ev: HashChangeEvent) => any) | null,
    ) {
      throw new Error();
    }

    get onlanguagechange():
      | ((this: WindowEventHandlers, ev: Event) => any)
      | null {
      throw new Error();
    }

    set onlanguagechange(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get onmessage():
      | ((this: WindowEventHandlers, ev: MessageEvent) => any)
      | null {
      throw new Error();
    }

    set onmessage(
      value: ((this: WindowEventHandlers, ev: MessageEvent) => any) | null,
    ) {
      throw new Error();
    }

    get onmessageerror():
      | ((this: WindowEventHandlers, ev: MessageEvent) => any)
      | null {
      throw new Error();
    }

    set onmessageerror(
      value: ((this: WindowEventHandlers, ev: MessageEvent) => any) | null,
    ) {
      throw new Error();
    }

    get onoffline(): ((this: WindowEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }

    set onoffline(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get ononline(): ((this: WindowEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }

    set ononline(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get onpagehide():
      | ((this: WindowEventHandlers, ev: PageTransitionEvent) => any)
      | null {
      throw new Error();
    }

    set onpagehide(
      value:
        | ((this: WindowEventHandlers, ev: PageTransitionEvent) => any)
        | null,
    ) {
      throw new Error();
    }

    get onpageshow():
      | ((this: WindowEventHandlers, ev: PageTransitionEvent) => any)
      | null {
      throw new Error();
    }

    set onpageshow(
      value:
        | ((this: WindowEventHandlers, ev: PageTransitionEvent) => any)
        | null,
    ) {
      throw new Error();
    }

    get onpopstate():
      | ((this: WindowEventHandlers, ev: PopStateEvent) => any)
      | null {
      throw new Error();
    }

    set onpopstate(
      value: ((this: WindowEventHandlers, ev: PopStateEvent) => any) | null,
    ) {
      throw new Error();
    }

    get onrejectionhandled():
      | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any)
      | null {
      throw new Error();
    }

    set onrejectionhandled(
      value:
        | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any)
        | null,
    ) {
      throw new Error();
    }

    get onstorage():
      | ((this: WindowEventHandlers, ev: StorageEvent) => any)
      | null {
      throw new Error();
    }

    set onstorage(
      value: ((this: WindowEventHandlers, ev: StorageEvent) => any) | null,
    ) {
      throw new Error();
    }

    get onunhandledrejection():
      | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any)
      | null {
      throw new Error();
    }

    set onunhandledrejection(
      value:
        | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any)
        | null,
    ) {
      throw new Error();
    }

    get onunload(): ((this: WindowEventHandlers, ev: Event) => any) | null {
      throw new Error();
    }

    set onunload(
      value: ((this: WindowEventHandlers, ev: Event) => any) | null,
    ) {
      throw new Error();
    }

    get ongamepadconnected():
      | ((this: WindowEventHandlers, ev: GamepadEvent) => any)
      | null {
      throw new Error();
    }

    set ongamepadconnected(
      value: ((this: WindowEventHandlers, ev: GamepadEvent) => any) | null,
    ) {
      throw new Error();
    }

    get ongamepaddisconnected():
      | ((this: WindowEventHandlers, ev: GamepadEvent) => any)
      | null {
      throw new Error();
    }

    set ongamepaddisconnected(
      value: ((this: WindowEventHandlers, ev: GamepadEvent) => any) | null,
    ) {
      throw new Error();
    }
  }

  return Mixin;
}

export interface WindowEventHandlers extends IWindowEventHandlers {}
