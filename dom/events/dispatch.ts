/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-dispatch)
 */
export function dispatch(
  event: Event,
  target: EventTarget,
  legacyTargetOverride?: boolean,
) {
  // TODO
  target.dispatchEvent(event);
}
