import type { IAbortSignal } from "../../interface.d.ts";
import { EventTarget } from "../events/event_target.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
import { fireEvent } from "../events/fire.ts";
import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "../../html/events.ts";

@Exposed("*")
export class AbortSignal extends EventTarget implements IAbortSignal {
  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-abort)
   */
  static abort(reason?: unknown): AbortSignal {
    // 1. Let signal be a new AbortSignal object.
    const signal = new AbortSignal();

    // 2. Set signal’s abort reason to reason if it is given; otherwise to a new "AbortError" DOMException.
    signal["_abortReason"] = typeof reason !== "undefined"
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
  static any(signals: Iterable<AbortSignal>): AbortSignal {
    // return the result of creating a dependent abort signal from signals using AbortSignal and the current realm.
    return createDependentAbortSignal(signals, AbortSignal, globalThis);
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-aborted)
   */
  get aborted(): boolean {
    // return true if this is aborted; otherwise false.
    return this._aborted;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-reason)
   */
  get reason(): unknown {
    // return this’s abort reason.
    return this._abortReason;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortsignal-throwifaborted)
   */
  throwIfAborted(): void {
    // throw this’s abort reason, if this is aborted.
    if (this._aborted) throw this._abortReason;
  }

  get onabort(): ((this: globalThis.AbortSignal, ev: Event) => any) | null {
    return getEventHandlerIDLAttribute(this, "onabort") as any;
  }

  set onabort(
    value: ((this: globalThis.AbortSignal, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "onabort", value);
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-abort-reason)
   */
  protected _abortReason: unknown;

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-abort-algorithms)
   */
  protected _abortAlgorithms: OrderedSet<Function> = new OrderedSet();

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-dependent)
   */
  protected _dependent = false;

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-source-signals)
   */
  protected _sourceSignals: OrderedSet<AbortSignal> = new OrderedSet(); // TODO: research weak set

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-dependent-signals)
   */
  protected _dependentSignals: OrderedSet<AbortSignal> = new OrderedSet(); // TODO: research weak set

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-aborted)
   */
  protected get _aborted(): boolean {
    return typeof this._abortReason !== "undefined";
  }
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-add)
 */
export function add(algorithm: Function, signal: AbortSignal): void {
  // If signal is aborted, then return.
  if (signal["_aborted"]) return;

  // Append algorithm to signal’s abort algorithms.
  signal["_abortAlgorithms"].append(algorithm);
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-remove)
 */
export function remove(algorithm: Function, signal: AbortSignal): void {
  // remove algorithm from signal’s abort algorithms.
  signal["_abortAlgorithms"].remove((item) => algorithm === item);
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-signal-abort)
 */
export function signalAbort(signal: AbortSignal, reason?: unknown): void {
  // 1. If signal is aborted, then return.
  if (signal["_aborted"]) return;

  // 2. Set signal’s abort reason to reason if it is given; otherwise to a new "AbortError" DOMException.
  signal["_abortReason"] = typeof reason !== "undefined"
    ? reason
    : new DOMException("<message>", DOMExceptionName.AbortError);

  // 3. For each algorithm of signal’s abort algorithms: run algorithm.
  for (const algorithm of signal["_abortAlgorithms"]) algorithm();

  // 4. Empty signal’s abort algorithms.
  signal["_abortAlgorithms"].empty();

  // 5. Fire an event named abort at signal.
  fireEvent("abort", signal);

  // 6. For each dependentSignal of signal’s dependent signals, signal abort on dependentSignal with signal’s abort reason.
  for (const dependentSignal of signal["_dependentSignals"]) {
    signalAbort(dependentSignal, signal["_abortReason"]);
  }
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#create-a-dependent-abort-signal)
 */
export function createDependentAbortSignal(
  signals: Iterable<AbortSignal>,
  signalInterface: { new (): AbortSignal },
  realm: unknown,
): AbortSignal {
  // 1. Let resultSignal be a new object implementing signalInterface using realm.
  // TODO: use realm
  const resultSignal = new signalInterface();

  // 2. For each signal of signals:
  for (const signal of signals) {
    // if signal is aborted, then set resultSignal’s abort reason to signal’s abort reason and return resultSignal.
    if (signal["_aborted"]) {
      resultSignal["_abortReason"] = signal["_abortReason"];
      return resultSignal;
    }
  }

  // 3. Set resultSignal’s dependent to true.
  resultSignal["_dependent"] = true;

  // 4. For each signal of signals:
  for (const signal of signals) {
    // 1. If signal’s dependent is false, then:
    if (!signal["_dependent"]) {
      // 1. Append signal to resultSignal’s source signals.
      resultSignal["_sourceSignals"].append(signal);

      // 2. Append resultSignal to signal’s dependent signals.
      signal["_dependentSignals"].append(resultSignal);

      // 2. Otherwise, for each sourceSignal of signal’s source signals:
    } else {
      for (const sourceSignal of signal["_sourceSignals"]) {
        // 1. Assert: sourceSignal is not aborted and not dependent.

        // 2. If resultSignal’s source signals contains sourceSignal, then continue.
        if (resultSignal["_sourceSignals"].contains(sourceSignal)) continue;

        // 3. Append sourceSignal to resultSignal’s source signals.
        resultSignal["_sourceSignals"].append(sourceSignal);

        // 4. Append resultSignal to sourceSignal’s dependent signals.
        sourceSignal["_dependentSignals"].append(resultSignal);
      }
    }
  }

  // 5. Return resultSignal.
  return resultSignal;
}

// TODO
/**
 *  @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#run-steps-after-a-timeout)
 */
export function runStepsAfterTimeout(
  global: WindowOrWorkerGlobalScope,
  orderingIdentifier: string,
  milliseconds: number,
  completionSteps: Function[],
  timerKey?: unknown,
) {}
