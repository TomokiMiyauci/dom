import { find, type RequiredBy, some } from "../../deps.ts";
import { List } from "../../infra/data_structures/list.ts";
import type { IEventTarget } from "../../interface.d.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { dispatch } from "./dispatch.ts";
import { $, internalSlots } from "../../internal.ts";
import { add } from "../aborts/abort_signal_utils.ts";

@Exposed("*")
export class EventTarget implements IEventTarget {
  constructor() {
    const internal = new EventTargetInternals();
    internalSlots.extends<EventTarget>(this, internal);
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options: boolean | AddEventListenerOptions = {},
  ): void {
    if (typeof options === "object") {
      options.once ??= false;
      options.capture ??= false;
    }

    // 1. Let capture, passive, once, and signal be the result of flattening more options.
    const { capture, passive, once, signal } = flattenMore(options as boolean);

    const eventListener = new EventListener({ callback, type });
    eventListener.capture = capture,
      eventListener.passive = passive,
      eventListener.once = once,
      eventListener.signal = signal;

    // 2. Add an event listener with this and an event listener whose type is type, callback is callback, capture is capture, passive is passive, once is once, and signal is signal.
    addEventListener(this, eventListener);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options: boolean | EventListenerOptions = {},
  ): void {
    // 1. Let capture be the result of flattening options.
    const capture = flatten(options);

    const eventListener = find(
      this.#_.eventListenerList,
      (listener) =>
        type === listener.type && callback === listener.callback &&
        capture === listener.capture,
    );
    // 2. If this’s event listener list contains an event listener whose type is type, callback is callback, and capture is capture, then remove an event listener with this and that event listener.
    if (eventListener) removeEventListener(this, eventListener);
  }

  dispatchEvent(event: Event): boolean {
    // 1. If event’s dispatch flag is set, or if its initialized flag is not set, then throw an "InvalidStateError" DOMException.
    if ($(event).dispatch && !$(event).initialized) {
      throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
    }

    // 2. Initialize event’s isTrusted attribute to false.
    $(event).isTrusted = false;

    // 3. Return the result of dispatching event to this.
    return dispatch(event, this);
  }

  get #_() {
    return $<EventTarget>(this);
  }
}

export class EventTargetInternals {
  eventListenerList: List<EventListener> = new List();

  activationBehavior: ActivationBehavior | undefined;

  getParent: (event: Event) => globalThis.EventTarget | null = () => null;
  legacyPreActivationBehavior: Function | undefined;
  legacyCanceledActivation: Function | undefined;
}

interface ActivationBehavior {
  (event: Event): void;
}

/**
 * @see https://dom.spec.whatwg.org/#concept-event-listener
 */
export class EventListener {
  /**
   * @see https://dom.spec.whatwg.org/#event-listener-type
   */
  type: string;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-callback
   */
  callback: globalThis.EventListener | EventListenerObject | null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-capture
   * @default false
   */
  capture = false;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-passive
   * @default null
   */
  passive: boolean | null = null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-once
   * @default false
   */
  once = false;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-signal
   */
  signal: AbortSignal | null = null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-removed
   * @default false
   */
  removed = false;

  constructor(
    { type, callback }: {
      type: string;
      callback: globalThis.EventListener | EventListenerObject | null;
    },
  ) {
    this.type = type;
    this.callback = callback;
  }
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-flatten-options)
 */
export function flatten(options: boolean | EventListenerOptions): boolean {
  // 1. If options is a boolean, then return options.
  if (typeof options === "boolean") return options;

  // 2. Return options["capture"].
  return !!options.capture;
}

interface FlattedOptions {
  capture: boolean;
  passive: boolean | null;
  once: boolean;
  signal: AbortSignal | null;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-flatten-more)
 */
export function flattenMore(
  options: boolean | RequiredBy<AddEventListenerOptions, "once" | "capture">,
): FlattedOptions {
  // 1. Let capture be the result of flattening options.
  const capture = flatten(options);

  // 2. Let once be false.
  let once = false;

  // 3. Let passive and signal be null.
  let passive = null, signal = null;

  // 4. If options is a dictionary, then:
  if (typeof options === "object") {
    // 1. Set once to options["once"].
    once = options.once;

    // 2. If options["passive"] exists, then set passive to options["passive"].
    if ("passive" in options && typeof options.passive === "boolean") {
      passive = options.passive;
    }

    // 3. If options["signal"] exists, then set signal to options["signal"].
    if ("signal" in options && options.signal) signal = options.signal;
  }

  // 5. Return capture, passive, once, and signal.
  return { capture, passive, once, signal };
}

const events = new Set<string>([
  "touchstart",
  "touchmove",
  "wheel",
  "mousewheel",
]);

export function defaultPassiveValue(
  type: string,
  eventTarget: globalThis.EventTarget,
): boolean {
  // 1. Return true if all of the following are true:
  if (
    // type is one of "touchstart", "touchmove", "wheel", or "mousewheel".
    events.has(type) &&
    // eventTarget is a Window object, or is a node whose node document is eventTarget, or is a node whose node document’s document element is eventTarget, or is a node whose node document’s body element is eventTarget.
    (eventTarget instanceof globalThis.Window ||
      ("_nodeDocument" in eventTarget &&
        eventTarget._nodeDocument === eventTarget) ||
      "_nodeDocument" in eventTarget &&
        typeof eventTarget._nodeDocument === "object" &&
        eventTarget._nodeDocument && "body" in eventTarget._nodeDocument &&
        eventTarget._nodeDocument.body === eventTarget)
  ) return false;

  return false;
}

/**
 * @see https://dom.spec.whatwg.org/#add-an-event-listener
 */
export function addEventListener(
  eventTarget: globalThis.EventTarget,
  listener: EventListener,
): void {
  // 1. If eventTarget is a ServiceWorkerGlobalScope object, its service worker’s script resource’s has ever been evaluated flag is set, and listener’s type matches the type attribute value of any of the service worker events, then report a warning to the console that this might not give the expected results. [SERVICE-WORKERS]

  // 2. If listener’s signal is not null and is aborted, then return.
  // TODO
  if (listener.signal) return;

  // 3. If listener’s callback is null, then return.
  if (!listener.callback) return;

  // 4. If listener’s passive is null, then set it to the default passive value given listener’s type and eventTarget.
  if (!listener.passive) {
    listener.passive = defaultPassiveValue(listener.type, eventTarget);
  }

  const contain = some(
    $(eventTarget).eventListenerList,
    ({ type, callback, capture }) =>
      type === listener.type && callback === listener.callback &&
      capture === listener.capture,
  );
  // 5. If eventTarget’s event listener list does not contain an event listener whose type is listener’s type, callback is listener’s callback, and capture is listener’s capture, then append listener to eventTarget’s event listener list.
  if (!contain) $(eventTarget).eventListenerList.append(listener);

  // 6. If listener’s signal is not null, then add the following abort steps to it:
  if (listener.signal) {
    add(() =>
      // 1. Remove an event listener with eventTarget and listener.
      removeEventListener(eventTarget, listener), listener.signal);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#remove-an-event-listener
 */
export function removeEventListener(
  eventTarget: globalThis.EventTarget,
  listener: EventListener,
): void {
  // 1. If eventTarget is a ServiceWorkerGlobalScope object and its service worker’s set of event types to handle contains listener’s type, then report a warning to the console that this might not give the expected results.

  // 2. Set listener’s removed to true and remove listener from eventTarget’s event listener list.
  listener.removed = true,
    $(eventTarget).eventListenerList.remove((target) => target === listener);
}
