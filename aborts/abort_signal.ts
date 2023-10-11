import type { IAbortSignal } from "../interface.d.ts";
import { EventTarget } from "../events/event_target.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { OrderedSet } from "../_internals/infra/data_structures/set.ts";
import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "../_internals/html/events.ts";
import { internalSlots } from "../internal.ts";
import {
  createDependentAbortSignal,
  runStepsAfterTimeout,
} from "./abort_signal_utils.ts";

@Exposed("*", "AbortSignal")
export class AbortSignal extends EventTarget implements IAbortSignal {
  constructor() {
    super();

    const internal = new AbortSignalInternals();
    internalSlots.extends<AbortSignal>(this, internal);
  }
  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-abort)
   */
  static abort(reason?: unknown): AbortSignal {
    // 1. Let signal be a new AbortSignal object.
    const signal = new AbortSignal();

    // 2. Set signal’s abort reason to reason if it is given; otherwise to a new "AbortError" DOMException.
    signal.#_.abortReason = typeof reason !== "undefined"
      ? reason
      : new DOMException("<message>", DOMExceptionName.AbortError);

    // 3. Return signal.
    return signal;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-timeout)
   */
  static timeout(milliseconds: number): AbortSignal {
    // 1. Let signal be a new AbortSignal object.
    const signal = new AbortSignal();

    // 2. Let global be signal’s relevant global object.
    // TODO

    // 3. Run steps after a timeout given global, "AbortSignal-timeout", milliseconds, and the following step:
    runStepsAfterTimeout(globalThis, "AbortSignal-timeout", milliseconds, [
      () => {
        // TODO
        // 1. Queue a global task on the timer task source given global to signal abort given signal and a new "TimeoutError" DOMException.
      },
    ]);

    // For the duration of this timeout, if signal has any event listeners registered for its abort event, there must be a strong reference from global to signal.

    // 4. Return signal.
    return signal;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-any)
   */
  static any(signals: Iterable<AbortSignal>): globalThis.AbortSignal {
    // return the result of creating a dependent abort signal from signals using AbortSignal and the current realm.
    return createDependentAbortSignal(signals, AbortSignal, globalThis);
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-aborted)
   */
  get aborted(): boolean {
    // return true if this is aborted; otherwise false.
    return this.#_.aborted;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-reason)
   */
  get reason(): unknown {
    // return this’s abort reason.
    return this.#_.abortReason;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-throwifaborted)
   */
  throwIfAborted(): void {
    // throw this’s abort reason, if this is aborted.
    if (this.#_.aborted) throw this.#_.abortReason;
  }

  get onabort(): ((this: globalThis.AbortSignal, ev: Event) => any) | null {
    return getEventHandlerIDLAttribute(this, "onabort") as any;
  }

  set onabort(
    value: ((this: globalThis.AbortSignal, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "onabort", value);
  }

  get #_() {
    return internalSlots.get<AbortSignal>(this);
  }
}

export class AbortSignalInternals {
  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-abort-reason)
   */
  abortReason: unknown;

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-abort-algorithms)
   */
  abortAlgorithms: OrderedSet<Function> = new OrderedSet();

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-dependent)
   */
  dependent = false;

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-source-signals)
   */
  sourceSignals: OrderedSet<globalThis.AbortSignal> = new OrderedSet(); // TODO: research weak set

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-dependent-signals)
   */
  dependentSignals: OrderedSet<globalThis.AbortSignal> = new OrderedSet(); // TODO: research weak set

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-aborted)
   */
  get aborted(): boolean {
    return typeof this.abortReason !== "undefined";
  }
}
