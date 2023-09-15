// import { createEvent } from "./construct.ts";
import { $ } from "../../internal.ts";
import { createEvent } from "./construct.ts";
import { dispatch } from "./dispatch.ts";
import { Event } from "./event.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-fire)
 */
export function fireEvent(
  e: string,
  target: EventTarget,
  eventConstructor: typeof Event = Event, // 1. If eventConstructor is not given, then let eventConstructor be Event.
  legacyTargetOverride?: boolean,
): void {
  // 2. Let event be the result of creating an event given eventConstructor, in the relevant realm of target.
  // TODO: relevant realm
  const event = createEvent(eventConstructor);

  // 3. Initialize event’s type attribute to e.
  $(event).type = e;

  // 4. Initialize any other IDL attributes of event as described in the invocation of this algorithm.
  $(event).isTrusted = false;

  // 5. Return the result of dispatching event at target, with legacy target override flag set if set.
  dispatch(event, target, legacyTargetOverride);
}
