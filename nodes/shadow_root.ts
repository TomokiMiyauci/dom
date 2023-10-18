import type { IShadowRoot } from "../interface.d.ts";
import { DocumentFragment } from "./document_fragment.ts";
import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "../_internals/html/events.ts";
import { $Element, ShadowRootInternals as _ } from "../i.ts";
import * as $$ from "../symbol.ts";

/**
 * @see https://dom.spec.whatwg.org/#interface-shadowroot
 */
export class ShadowRoot extends DocumentFragment implements IShadowRoot, _ {
  protected constructor() {
    super();
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-mode)
   */
  get mode(): ShadowRootMode {
    // return this’s mode.
    return this[$$.mode];
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
    return this[$$.slotAssignment];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-host)
   */
  get host(): Element {
    // return this’s host.
    throw this[$$.host];
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

  /**
   * @remarks Set after creation
   */
  [$$.host]!: $Element;

  /**
   * @remarks Set after creation
   */
  [$$.mode]!: ShadowRootMode;

  [$$.delegatesFocus]: boolean = false;
  [$$.availableElementInternals]: boolean = false;
  [$$.slotAssignment]: SlotAssignmentMode = "named";
}
