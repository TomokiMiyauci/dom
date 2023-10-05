/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#events
 * @module
 */

import {
  addEventListener,
  EventListener,
  removeEventListener,
} from "../dom/events/event_target.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-name
 */
export type EventHandlerName = `on${string}`;

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers
 */
export class EventHandler {
  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-value
   * @default null
   */
  value: Function | null = null;

  /**
   * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-listener
   * @default null
   */
  listener: EventListener | null = null;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#determining-the-target-of-an-event-handler
 */
export function determineEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): EventTarget | null {
  // 1. If eventTarget is not a body element or a frameset element, then return eventTarget.

  // 2. If name is not the name of an attribute member of the WindowEventHandlers interface mixin and the Window-reflecting body element event handler set does not contain name, then return eventTarget.

  // 3. If eventTarget's node document is not an active document, then return null.

  // 4. Return eventTarget's node document's relevant global object.
  return eventTarget;
}

class HandlerMap extends Map<EventHandlerName, EventHandler> {
  override get(key: `on${string}`): EventHandler {
    if (super.has(key)) return super.get(key)!;

    const handler = new EventHandler();
    super.set(key, handler);

    return handler;
  }
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-map
 */
class EventHandlerMap extends WeakMap<EventTarget, HandlerMap> {
  override get(key: EventTarget): HandlerMap {
    if (super.has(key)) return super.get(key)!;

    const handlerMap = new HandlerMap();

    super.set(key, handlerMap);

    return handlerMap;
  }
}

const eventHandlerMap = new EventHandlerMap();

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-idl-attributes)
 */
export function getEventHandlerIDLAttribute(
  target: EventTarget,
  name: EventHandlerName,
): Function | null {
  // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
  const eventTarget = determineEventHandler(target, name);

  // 2. If eventTarget is null, then return null.
  if (!eventTarget) return null;

  // 3. Return the result of getting the current value of the event handler given eventTarget and name.
  return getEventHandlerCurrentValue(eventTarget, name);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-idl-attributes)
 */
export function setEventHandlerIDLAttribute(
  target: EventTarget,
  name: EventHandlerName,
  value: Function | null,
): void {
  // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
  const eventTarget = determineEventHandler(target, name);

  // 2. If eventTarget is null, then return.
  if (!eventTarget) return;

  // 3. If the given value is null, then deactivate an event handler given eventTarget and name.
  if (!value) deactivateEventHandler(eventTarget, name);
  // 4. Otherwise:
  else {
    // 1. Let handlerMap be eventTarget's event handler map.
    const handlerMap = eventHandlerMap.get(eventTarget);

    // 2. Let eventHandler be handlerMap[name].
    const eventHandler = handlerMap.get(name);

    // 3. Set eventHandler's value to the given value.
    eventHandler.value = value;

    // 4. Activate an event handler given eventTarget and name.
    activateEventHandler(eventTarget, name);
  }
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#getting-the-current-value-of-the-event-handler
 */
export function getEventHandlerCurrentValue(
  eventTarget: EventTarget,
  name: EventHandlerName,
): Function | null {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget);

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap.get(name);

  // 4. Return eventHandler's value.
  return eventHandler.value;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#deactivate-an-event-handler
 */
export function deactivateEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): void {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget);

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap.get(name);

  // 3. Set eventHandler's value to null.
  eventHandler.value = null;

  // 4. Let listener be eventHandler's listener.
  const listener = eventHandler.listener;

  // 5. If listener is not null, then remove an event listener with eventTarget and listener.
  if (listener) removeEventListener(eventTarget, listener);

  // 6. Set eventHandler's listener to null.
  eventHandler.listener = null;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#activate-an-event-handler
 */
export function activateEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
): void {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget);

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap.get(name);

  // 3. If eventHandler's listener is not null, then return.
  if (eventHandler.listener) return;

  // 4. Let callback be the result of creating a Web IDL EventListener instance representing a reference to a function of one argument that executes the steps of the event handler processing algorithm, given eventTarget, name, and its argument.
  // TODO
  const callback = (ev: Event) =>
    eventHandlerProcessingAlgorithm(eventTarget, name, ev);

  // The EventListener's callback context can be arbitrary; it does not impact the steps of the event handler processing algorithm. [DOM]

  // 5. Let listener be a new event listener whose type is the event handler event type corresponding to eventHandler and callback is callback.
  // TODO
  const listener = new EventListener({ type: name.slice(2), callback });

  // 6. Add an event listener with eventTarget and listener.
  addEventListener(eventTarget, listener);

  // 7. Set eventHandler's listener to listener.
  eventHandler.listener = listener;
}

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#the-event-handler-processing-algorithm
 */
export function eventHandlerProcessingAlgorithm(
  eventTarget: EventTarget,
  name: EventHandlerName,
  event: Event,
): void {
  // 1. Let callback be the result of getting the current value of the event handler given eventTarget and name.
  const callback = getEventHandlerCurrentValue(eventTarget, name);

  // 2. If callback is null, then return.
  if (!callback) return;

  // 3. Let special error event handling be true if event is an ErrorEvent object, event's type is "error", and event's currentTarget implements the WindowOrWorkerGlobalScope mixin. Otherwise, let special error event handling be false.

  // 4. Process the Event object event as follows:

  // If special error event handling is true

  // Otherwise
  // Invoke callback with one argument, the value of which is the Event object event, with the callback this value set to event's currentTarget. Let return value be the callback's return value. [WEBIDL]
  callback.apply(eventTarget, [event]);

  // If an exception gets thrown by the callback, end these steps and allow the exception to propagate. (It will propagate to the DOM event dispatch logic, which will then report the exception.)

  // 5. Process return value as follows:

  // If event is a BeforeUnloadEvent object and event's type is "beforeunload"
  // If special error event handling is true
  // Otherwise
}
