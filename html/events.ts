/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#events
 * @module
 */

import type { EventListener } from "../events/types.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-name
 */
export type EventHandlerName = `on${string}`;

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers
 */
export interface EventHandler {
  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-value
   * @default null
   */
  value: Function | null;

  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-listener
   * @default null
   */
  listener: EventListener | null;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-map
 */
export type EventHandlerMap = Map<EventHandlerName, EventHandler>;

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#determining-the-target-of-an-event-handler
 */
export function determineEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): EventTarget | null {
  return eventTarget;
}

interface EventTargetStates {
  eventHandlerMap: EventHandlerMap;
}

const store = new WeakMap<EventTarget, EventTargetStates>();

export function $(eventTarget: EventTarget): EventTargetStates {
  const states = store.get(eventTarget);

  if (states) return states;

  throw new Error("not found internal slot");
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#getting-the-current-value-of-the-event-handler
 */
export function getEventHandlerCurrentValue(
  eventTarget: EventTarget,
  name: EventHandlerName,
): null {
  throw new Error("getEventHandlerCurrentValue");
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#deactivate-an-event-handler
 */
export function deactivateEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): void {
  throw new Error("deactivateEventHandler");
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#activate-an-event-handler
 */
export function activateEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): void {
  throw new Error("activateEventHandler");
}
