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
 * @see https://dom.spec.whatwg.org/#add-an-event-listener
 */
export function addEventListener(
  eventTarget: EventTarget,
  listener: EventListener,
): void {
  // TODO
  eventTarget.addEventListener(listener.type, listener.callback);
}

/**
 * @see https://dom.spec.whatwg.org/#remove-an-event-listener
 */
export function removeEventListener(
  eventTarget: EventTarget,
  listener: EventListener,
): void {
  // TODO
  eventTarget.removeEventListener(listener.type, listener.callback);

  // 2. Set listener’s removed to true and remove listener from eventTarget’s event listener list.
  // TODO
  listener.removed = true;
}
