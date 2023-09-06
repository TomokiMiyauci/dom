// import { createEvent } from "./construct.ts";
import { dispatch } from "./dispatch.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-fire)
 */
export function fireEvent(
  name: string,
  target: EventTarget,
  eventConstructor?: Event,
  legacyTargetOverride?: boolean,
): void {
  // 1. If eventConstructor is not given, then let eventConstructor be Event.
  eventConstructor ??= Event.prototype;

  // 2. Let event be the result of creating an event given eventConstructor, in the relevant realm of target.
  // TODO: relevant realm
  const event = new Event(name);

  // 3. Initialize event’s type attribute to e.
  // TODO

  // 4. Initialize any other IDL attributes of event as described in the invocation of this algorithm.

  // 5. Return the result of dispatching event at target, with legacy target override flag set if set.
  dispatch(event, target, legacyTargetOverride);
}
