import { EventTargetInternals } from "../../../../events/event_target.ts";
import { EventHandler, type EventHandlerName } from "../../events.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-map
 */
class EventHandlerMap extends Map<EventHandlerName, EventHandler> {
  override get(key: EventHandlerName): EventHandler {
    if (super.has(key)) return super.get(key)!;

    const eventHandler = new EventHandler();

    super.set(key, eventHandler);

    return eventHandler;
  }
}

declare module "../../../../events/event_target.ts" {
  interface EventTargetInternals {
    /**
     * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-map)
     */
    eventHandlerMap: EventHandlerMap;
  }
}

EventTargetInternals.prototype.eventHandlerMap = new EventHandlerMap();
