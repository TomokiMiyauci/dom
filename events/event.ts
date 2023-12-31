import { List } from "../_internals/infra/data_structures/list.ts";
import type { IEvent } from "../interface.d.ts";
import { $, internalSlots } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { Const, constant } from "../_internals/webidl/idl.ts";
import { Steps } from "../infra/applicable.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#potential-event-target)
 */
export type PotentialEventTarget = EventTarget | null;

@Exposed("*", "Event")
export class Event implements IEvent {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-event)
   */
  constructor(type: string, eventInitDict: EventInit = {}) {
    const { bubbles = false, cancelable = false, composed = false } =
      eventInitDict;
    this.#timestamp = Date.now();

    const internal = new EventInternals();

    internal.type = type;
    internal.composed = composed;
    internal.bubbles = bubbles;
    internal.cancelable = cancelable;
    internalSlots.extends<Event>(this, internal);
  }

  get type(): string {
    // return the value it was initialized to
    return this.#_.type;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-target)
   */
  get target(): EventTarget | null {
    // return this’s target.
    return this.#_.target;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-srcelement)
   */
  get srcElement(): EventTarget | null {
    // return this’s target.
    return this.#_.target;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-currenttarget)
   */
  get currentTarget(): EventTarget | null {
    // return the value it was initialized to
    return this.#_.currentTarget;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-composedpath)
   */
  composedPath(): EventTarget[] {
    // 1. Let composedPath be an empty list.
    const composedPath = new List<EventTarget>();

    // 2. Let path be this’s path.
    const path = this.#_.path;

    // 3. If path is empty, then return composedPath.
    if (path.isEmpty) return [...composedPath];

    // 4. Let currentTarget be this’s currentTarget attribute value.
    const currentTarget = this.currentTarget;

    // 5. Append currentTarget to composedPath.
    if (currentTarget) composedPath.append(currentTarget);

    // 6. Let currentTargetIndex be 0.
    let currentTargetIndex = 0;

    // 7. Let currentTargetHiddenSubtreeLevel be 0.
    let currentTargetHiddenSubtreeLevel = 0;

    // 8. Let index be path’s size − 1.
    let index = path.size - 1;

    // 9. While index is greater than or equal to 0:
    while (index >= 0) {
      // 1. If path[index]'s root-of-closed-tree is true, then increase currentTargetHiddenSubtreeLevel by 1.
      if (path[index]?.rootOfClosedTree) currentTargetHiddenSubtreeLevel += 1;

      // 2. If path[index]'s invocation target is currentTarget, then set currentTargetIndex to index and break.
      if (path[index]?.invocationTarget === currentTarget) {
        currentTargetIndex = index;
        break;
      }

      // 3. If path[index]'s slot-in-closed-tree is true, then decrease currentTargetHiddenSubtreeLevel by 1.
      if (path[index]?.slotInClosedTree) currentTargetHiddenSubtreeLevel -= 1;

      // 4. Decrease index by 1.
      index -= 1;
    }

    // 10. Let currentHiddenLevel and maxHiddenLevel be currentTargetHiddenSubtreeLevel.
    let currentHiddenLevel = currentTargetHiddenSubtreeLevel,
      maxHiddenLevel = currentTargetHiddenSubtreeLevel;

    // 11. Set index to currentTargetIndex − 1.
    index = currentTargetIndex - 1;

    // 12. While index is greater than or equal to 0:
    while (index >= 0) {
      // 1. If path[index]'s root-of-closed-tree is true, then increase currentHiddenLevel by 1.
      if (path[index]?.rootOfClosedTree) currentHiddenLevel += 1;

      // 2. If currentHiddenLevel is less than or equal to maxHiddenLevel, then prepend path[index]'s invocation target to composedPath.
      if (currentHiddenLevel <= maxHiddenLevel) {
        const target = path[index]?.invocationTarget;
        if (target) composedPath.prepend(target);
      }

      // 3. If path[index]'s slot-in-closed-tree is true, then:
      if (path[index]?.slotInClosedTree) {
        // 1. Decrease currentHiddenLevel by 1.
        currentHiddenLevel -= 1;

        // 2. If currentHiddenLevel is less than maxHiddenLevel, then set maxHiddenLevel to currentHiddenLevel.
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }

      // 4. Decrease index by 1.
      index -= 1;
    }

    // 13. Set currentHiddenLevel and maxHiddenLevel to currentTargetHiddenSubtreeLevel.
    currentHiddenLevel = currentTargetHiddenSubtreeLevel,
      maxHiddenLevel = currentTargetHiddenSubtreeLevel;

    // 14. Set index to currentTargetIndex + 1.
    index = currentTargetIndex + 1;

    // 15. While index is less than path’s size:
    while (index < path.size) {
      // 1. If path[index]'s slot-in-closed-tree is true, then increase currentHiddenLevel by 1.
      if (path[index]?.slotInClosedTree) currentHiddenLevel += 1;

      // 2. If currentHiddenLevel is less than or equal to maxHiddenLevel, then append path[index]'s invocation target to composedPath.
      if (currentHiddenLevel <= maxHiddenLevel) {
        const target = path[index]?.invocationTarget;

        if (target) composedPath.append(target);
      }

      // 3. If path[index]'s root-of-closed-tree is true, then:
      if (path[index]?.rootOfClosedTree) {
        // 1. Decrease currentHiddenLevel by 1.
        currentHiddenLevel -= 1;

        // 2. If currentHiddenLevel is less than maxHiddenLevel, then set maxHiddenLevel to currentHiddenLevel.
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }

      // 4. Increase index by 1.
      index += 1;
    }

    // 16. Return composedPath.
    return [...composedPath];
  }

  @constant
  static NONE = 0 as const;

  @constant
  static CAPTURING_PHASE = 1 as const;

  @constant
  static AT_TARGET = 2 as const;

  @constant
  static BUBBLING_PHASE = 3 as const;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-eventphase)
   */
  get eventPhase(): number {
    // return the value it was initialized to
    return this.#_.eventPhase;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-stoppropagation)
   */
  stopPropagation(): void {
    // set this’s stop propagation flag.
    this.#_.stopPropagation = true;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-cancelbubble)
   */
  get cancelBubble(): boolean {
    // return true if this’s stop propagation flag is set; otherwise false.
    return this.#_.stopPropagation;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-cancelbubble)
   */
  private set cancelBubble(value: boolean) {
    // set this’s stop propagation flag if the given value is true; otherwise do nothing.
    if (value) this.#_.stopPropagation = true;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-stopimmediatepropagation)
   */
  stopImmediatePropagation(): void {
    // set this’s stop propagation flag and this’s stop immediate propagation flag.
    this.#_.stopPropagation = true, this.#_.stopImmediatePropagation = true;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-bubbles)
   */
  get bubbles(): boolean {
    return this.#_.bubbles;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-cancelable)
   */
  get cancelable(): boolean {
    return this.#_.cancelable;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-returnvalue)
   */
  get returnValue(): boolean {
    // return false if this’s canceled flag is set; otherwise true.
    return !this.#_.canceled;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-returnvalue)
   */
  set returnValue(value: boolean) {
    // set the canceled flag with this if the given value is false; otherwise do nothing.
    if (!value) setCanceled(this);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-preventdefault)
   */
  preventDefault(): void {
    // set the canceled flag with this.
    setCanceled(this);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-defaultprevented)
   */
  get defaultPrevented(): boolean {
    // return true if this’s canceled flag is set; otherwise false.
    return this.#_.canceled;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-composed)
   */
  get composed(): boolean {
    // return true if this’s composed flag is set; otherwise false.
    return this.#_.composed;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-istrusted)
   */
  get isTrusted(): boolean {
    // return the value it was initialized to
    return this.#_.isTrusted;
  }

  #timestamp: number;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-timestamp)
   */
  get timeStamp(): number {
    //  return the value it was initialized to.
    return this.#timestamp;
  }

  private set timestamp(value: number) {
    this.#timestamp = value;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-event-initevent)
   */
  initEvent(
    type: string,
    bubbles = false,
    cancelable = false,
  ): void {
    // 1. If this’s dispatch flag is set, then return.
    if (this.#_.dispatch) return;

    // 2. Initialize this with type, bubbles, and cancelable.
    initialize(this, type, bubbles, cancelable);
  }

  get #_() {
    return $<Event>(this);
  }
}

export interface Event
  extends
    Const<"NONE", 0>,
    Const<"CAPTURING_PHASE", 1>,
    Const<"AT_TARGET", 2>,
    Const<"BUBBLING_PHASE", 3> {}

export class EventInternals {
  target: PotentialEventTarget = null;
  relatedTarget: PotentialEventTarget = null;
  touchTargetList: List<PotentialEventTarget> = new List();
  path: List<Struct> = new List();
  stopPropagation = false;
  stopImmediatePropagation = false;
  canceled = false;
  cancelable = false;
  inPassiveListener = false;
  composed = false;
  initialized = false;
  dispatch = false;
  bubbles = false;

  // When an event is created the attribute must be initialized to the empty string.
  type = "";

  // When an event is created the attribute must be initialized to false.
  isTrusted = false;

  eventPhase: 0 | 1 | 2 | 3 = 0;

  // When an event is created the attribute must be initialized to null.
  currentTarget: EventTarget | null = null;

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-constructor-ext)
   */
  eventConstructionSteps: Steps<
    [event: globalThis.Event, eventInitDict: EventInit]
  > = new Steps();
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path)
 */
export interface Struct {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-invocation-target)
   */
  invocationTarget: EventTarget;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-shadow-adjusted-target)
   */
  invocationTargetInShadowTree: boolean;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-shadow-adjusted-target)
   */
  shadowAdjustedTarget: PotentialEventTarget;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-relatedtarget)
   */
  relatedTarget: PotentialEventTarget;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-touch-target-list)
   */
  touchTargetList: List<PotentialEventTarget>;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-root-of-closed-tree)
   */
  rootOfClosedTree: boolean;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#event-path-slot-in-closed-tree)
   */
  slotInClosedTree: boolean;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-event-initialize)
 */
export function initialize(
  event: Event,
  type: string,
  bubbles: boolean,
  cancelable: boolean,
): void {
  // 1. Set event’s initialized flag.
  $(event).initialized = true;

  // 2. Unset event’s stop propagation flag, stop immediate propagation flag, and canceled flag.
  $(event).stopPropagation = false,
    $(event).stopImmediatePropagation = false,
    $(event).canceled = false;

  // 3. Set event’s isTrusted attribute to false.
  $(event).isTrusted = false;

  // 4. Set event’s target to null.
  $(event).target = null;

  // 5. Set event’s type attribute to type.
  $(event).type = type;

  // 6. Set event’s bubbles attribute to bubbles.
  $(event).bubbles = bubbles;

  // 7. Set event’s cancelable attribute to cancelable.
  $(event).cancelable = cancelable;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#set-the-canceled-flag)
 */
export function setCanceled(event: Event): void {
  // if event’s cancelable attribute value is true and event’s in passive listener flag is unset,
  if (event.cancelable && !$(event).inPassiveListener) {
    // then set event’s canceled flag, and do nothing otherwise.
    $(event).canceled = true;
  }
}
