import type { IShadowRoot } from "../../interface.d.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { DocumentOrShadowRoot } from "./node_trees/document_or_shadow_root.ts";
import { InnerHTML } from "../../domparsing/inner_html.ts";
import {
  getEventHandlerIDLAttribute,
  setEventHandlerIDLAttribute,
} from "../../html/events.ts";
import { internalSlots } from "../../internal.ts";

@DocumentOrShadowRoot
@InnerHTML
/**
 * @see https://dom.spec.whatwg.org/#interface-shadowroot
 */
export class ShadowRoot extends DocumentFragment implements IShadowRoot {
  constructor({ host }: { host: Element }) {
    super();

    const _ = Object.assign(this._, new ShadowRootInternals(host));
    this._ = _;
    internalSlots.set(this, _);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-mode)
   */
  get mode(): ShadowRootMode {
    // return this’s mode.
    return this._.mode;
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
    return this._.slotAssignment;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-shadowroot-host)
   */
  get host(): Element {
    // return this’s host.
    throw this._.host;
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

  declare protected _: ShadowRootInternals & DocumentFragment["_"];
}

export interface ShadowRoot extends DocumentOrShadowRoot, InnerHTML {}

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
  host: Element;

  constructor(host: Element) {
    this.host = host;
  }
}
