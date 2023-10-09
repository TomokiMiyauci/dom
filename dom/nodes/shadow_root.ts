import type { IShadowRoot } from "../../interface.d.ts";
import { DocumentFragment } from "./document_fragment.ts";
import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "../../html/events.ts";
import { internalSlots } from "../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#interface-shadowroot
 */
export class ShadowRoot extends DocumentFragment implements IShadowRoot {
  constructor() {
    super();

    internalSlots.extends<ShadowRoot>(this, new ShadowRootInternals());
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-mode)
   */
  get mode(): ShadowRootMode {
    // return this’s mode.
    return this.#_.mode;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-delegatesfocus)
   */
  get delegatesFocus(): boolean {
    // return this’s delegates focus.
    return this.delegatesFocus;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-slotassignment)
   */
  get slotAssignment(): SlotAssignmentMode {
    // return this’s delegates focus.
    return this.#_.slotAssignment;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-host)
   */
  get host(): Element {
    // return this’s host.
    throw this.#_.host;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-onslotchange)
   */
  get onslotchange(): ((this: globalThis.ShadowRoot, ev: Event) => any) | null {
    return getEventHandlerIDLAttribute(this, "onslotchange") as any;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-onslotchange)
   */
  set onslotchange(
    value: ((this: globalThis.ShadowRoot, ev: Event) => any) | null,
  ) {
    setEventHandlerIDLAttribute(this, "onslotchange", value);
  }

  get #_() {
    return internalSlots.get<ShadowRoot>(this);
  }
}

export class ShadowRootInternals {
  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-mode)
   */

  mode!: ShadowRootMode;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-delegates-focus)
   */
  delegatesFocus = false;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#shadowroot-available-to-element-internals)
   */

  availableElementInternals = false;

  slotAssignment: SlotAssignmentMode = "named";

  host!: Element;
}
