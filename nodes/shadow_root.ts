import type { IShadowRoot } from "../interface.d.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { DocumentOrShadowRoot } from "./document_or_shadow_root.ts";
import { InnerHTML } from "../domparsing/inner_html.ts";

@DocumentOrShadowRoot
@InnerHTML
/**
 * @see https://dom.spec.whatwg.org/#interface-shadowroot
 */
export class ShadowRoot extends DocumentFragment implements IShadowRoot {
  get mode(): ShadowRootMode {
    throw new Error("mode");
  }

  get delegatesFocus(): boolean {
    throw new Error("delegatesFocus");
  }

  get slotAssignment(): SlotAssignmentMode {
    throw new Error("slotAssignment");
  }

  get host(): Element {
    throw new Error("host");
  }

  get onslotchange(): ((this: globalThis.ShadowRoot, ev: Event) => any) | null {
    throw new Error("onslotchange");
  }

  set onslotchange(
    value: ((this: globalThis.ShadowRoot, ev: Event) => any) | null,
  ) {
    throw new Error("onslotchange");
  }
}

export interface ShadowRoot extends DocumentOrShadowRoot, InnerHTML {}
