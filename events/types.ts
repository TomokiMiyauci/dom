/**
 * @see https://dom.spec.whatwg.org/#concept-event-listener
 */
export interface EventListener {
  /**
   * @see https://dom.spec.whatwg.org/#event-listener-type
   */
  type: string;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-callback
   */
  callback: EventListenerObject | null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-capture
   * @default false
   */
  capture: boolean;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-passive
   * @default null
   */
  passive: boolean | null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-once
   * @default false
   */
  once: boolean;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-signal
   */
  signal: AbortSignal | null;

  /**
   * @see https://dom.spec.whatwg.org/#event-listener-removed
   * @default false
   */
  removed: boolean;
}
