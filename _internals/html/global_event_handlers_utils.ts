import { createEvent } from "../../dom/events/construct.ts";
import { dispatch } from "../../dom/events/dispatch.ts";
import { $ } from "../../internal.ts";
import { MouseEvent } from "../uievents/mouse_event.ts";

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#fire-a-synthetic-pointer-event)
 */
export function fireSyntheticPointerEvent(
  e: string,
  target: EventTarget,
  notTrusted?: boolean,
): boolean {
  // 1. Let event be the result of creating an event using PointerEvent.
  // TODO: use PointerEvent
  const event = createEvent(MouseEvent);

  // 2. Initialize event's type attribute to e.
  $(event).type = e;

  // 3. Initialize event's bubbles and cancelable attributes to true.
  $(event).bubbles = true, $(event).cancelable = true;

  // 4. Set event's composed flag.
  $(event).composed = true;

  // 5. If the not trusted flag is set, initialize event's isTrusted attribute to false.
  if (notTrusted) $(event).isTrusted = false;

  // 6. Initialize event's ctrlKey, shiftKey, altKey, and metaKey attributes according to the current state of the key input device, if any (false for any keys that are not available).

  // 7. Initialize event's view attribute to target's node document's Window object, if any, and null otherwise.

  // 8. event's getModifierState() method is to return values appropriately describing the current state of the key input device.

  // 9. Return the result of dispatching event at target.
  return dispatch(event, target);
}
