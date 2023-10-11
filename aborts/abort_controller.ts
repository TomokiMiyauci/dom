import type { IAbortController } from "../interface.d.ts";
import { AbortSignal } from "./abort_signal.ts";
import { signalAbort as abortSignal } from "./utils/abort_signal.ts";
import {
  Exposed,
  SameObject,
} from "../_internals/webidl/extended_attribute.ts";

@Exposed("*", "AbortController")
export class AbortController implements IAbortController {
  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortcontroller-abortcontroller)
   */
  constructor() {
    // 1. Let signal be a new AbortSignal object.
    const signal = new AbortSignal();

    // 2. Set this’s signal to signal.
    this._signal = signal;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortcontroller-signal)
   */
  @SameObject
  get signal(): AbortSignal {
    // return this’s signal.
    return this._signal;
  }

  /**
   *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-abortcontroller-abort)
   */
  abort(reason?: unknown): void {
    // signal abort on this with reason if it is given.
    signalAbort(this, reason);
  }

  protected _signal: AbortSignal;
}

/**
 *  @see [DOM Living Standard](https://dom.spec.whatwg.org/#abortcontroller-signal-abort)
 */
export function signalAbort(
  controller: AbortController,
  reason?: unknown,
): void {
  // signal abort on controller’s signal with reason if it is given.
  abortSignal(controller["_signal"], reason);
}
