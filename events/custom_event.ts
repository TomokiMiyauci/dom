// deno-lint-ignore-file no-explicit-any
import type { ICustomEvent } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { Event, initialize } from "./event.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#interface-customevent)
 */
@Exposed("*", "CustomEvent")
export class CustomEvent<T = any> extends Event implements ICustomEvent {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-customevent-customevent)
   */
  constructor(type: string, eventInitDict: CustomEventInit<T> = {}) {
    super(type, eventInitDict);
    const { detail = null } = eventInitDict;

    this.#detail = detail as T;
  }

  #detail: T;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-customevent-detail)
   */
  get detail(): T {
    // return the value it was initialized to.
    return this.#detail;
  }

  private set detail(value: T) {
    this.#detail = value;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-customevent-initcustomevent)
   */
  initCustomEvent(
    type: string,
    bubbles = false,
    cancelable = false,
    detail: T = null as T,
  ): void {
    // 1. If this’s dispatch flag is set, then return.
    if ($<CustomEvent>(this).dispatch) return;

    // 2. Initialize this with type, bubbles, and cancelable.
    initialize(this, type, bubbles, cancelable);

    // 3. Set this’s detail attribute to detail.
    this.detail = detail;
  }
}
