import type { Event } from "./event.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-create)
 */
export function createEvent(
  eventInterface: typeof Event,
  realm: unknown = null, // 1. If realm is not given, then set it to null.
): Event {
  // 2. Let dictionary be the result of converting the JavaScript value undefined to the dictionary type accepted by eventInterface’s constructor. (This dictionary type will either be EventInit or a dictionary that inherits from it.)
  const dictionary: EventInit = {
    bubbles: false,
    cancelable: false,
    composed: false,
  };
  // TODO
  const time = Date.now();

  // 3. Let event be the result of running the inner event creation steps with eventInterface, realm, the time of the occurrence that the event is signaling, and dictionary.
  const event = innerEventCreationSteps(
    eventInterface,
    realm,
    time,
    dictionary,
  );

  // 4. Initialize event’s isTrusted attribute to true.
  event["isTrusted"] = true;

  // 5. Return event.
  return event;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#inner-event-creation-steps)
 */
export function innerEventCreationSteps(
  interface_: typeof Event,
  realm: unknown,
  time: number,
  dictionary: EventInit,
): Event {
  // 1. Let event be the result of creating a new object using eventInterface. If realm is non-null, then use that realm; otherwise, use the default behavior defined in Web IDL. // 4. For each member → value in dictionary, if event has an attribute whose identifier is member, then initialize that attribute to value.
  const event: Event = new interface_("", dictionary);

  // 2. Set event’s initialized flag.
  event["_initialized"] = true;

  // 3. Initialize event’s timeStamp attribute to the relative high resolution coarse time given time and event’s relevant global object.

  // 5. Run the event constructing steps with event and dictionary.
  event["eventConstructionSteps"].run(event, dictionary);

  // 6. Return event.
  return event;
}
