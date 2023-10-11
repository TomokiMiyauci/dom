import { $ } from "../../internal.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { fireEvent } from "../events/fire.ts";

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-add)
 */
export function add(algorithm: Function, signal: AbortSignal): void {
  // If signal is aborted, then return.
  if ($(signal).aborted) return;

  // Append algorithm to signal’s abort algorithms.
  $(signal).abortAlgorithms.append(algorithm);
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-remove)
 */
export function remove(algorithm: Function, signal: AbortSignal): void {
  // remove algorithm from signal’s abort algorithms.
  $(signal).abortAlgorithms.remove((item) => algorithm === item);
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortsignal-signal-abort)
 */
export function signalAbort(signal: AbortSignal, reason?: unknown): void {
  // 1. If signal is aborted, then return.
  if ($(signal).aborted) return;

  // 2. Set signal’s abort reason to reason if it is given; otherwise to a new "AbortError" DOMException.
  $(signal).abortReason = typeof reason !== "undefined"
    ? reason
    : new DOMException("<message>", DOMExceptionName.AbortError);

  // 3. For each algorithm of signal’s abort algorithms: run algorithm.
  for (const algorithm of $(signal).abortAlgorithms) algorithm();

  // 4. Empty signal’s abort algorithms.
  $(signal).abortAlgorithms.empty();

  // 5. Fire an event named abort at signal.
  fireEvent("abort", signal);

  // 6. For each dependentSignal of signal’s dependent signals, signal abort on dependentSignal with signal’s abort reason.
  for (const dependentSignal of $(signal).dependentSignals) {
    signalAbort(dependentSignal, $(signal).abortReason);
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
    if ($(signal).aborted) {
      $(resultSignal).abortReason = $(signal).abortReason;
      return resultSignal;
    }
  }

  // 3. Set resultSignal’s dependent to true.
  $(resultSignal).dependent = true;

  // 4. For each signal of signals:
  for (const signal of signals) {
    // 1. If signal’s dependent is false, then:
    if (!$(signal).dependent) {
      // 1. Append signal to resultSignal’s source signals.
      $(resultSignal).sourceSignals.append(signal);

      // 2. Append resultSignal to signal’s dependent signals.
      $(signal).dependentSignals.append(resultSignal);

      // 2. Otherwise, for each sourceSignal of signal’s source signals:
    } else {
      for (const sourceSignal of $(signal).sourceSignals) {
        // 1. Assert: sourceSignal is not aborted and not dependent.

        // 2. If resultSignal’s source signals contains sourceSignal, then continue.
        if ($(resultSignal).sourceSignals.contains(sourceSignal)) continue;

        // 3. Append sourceSignal to resultSignal’s source signals.
        $(resultSignal).sourceSignals.append(sourceSignal);

        // 4. Append resultSignal to sourceSignal’s dependent signals.
        $(sourceSignal).dependentSignals.append(resultSignal);
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
