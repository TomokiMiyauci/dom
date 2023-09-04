import type { IShadowRoot } from "../../interface.d.ts";
import { DocumentFragment } from "./document_fragment.ts";
import { type Element } from "./elements/element.ts";
import { DocumentOrShadowRoot } from "./node_trees/document_or_shadow_root.ts";
import { InnerHTML } from "../../domparsing/inner_html.ts";
import { $host, $slotAssignment } from "./internal.ts";

@DocumentOrShadowRoot
@InnerHTML
/**
 * @see https://dom.spec.whatwg.org/#interface-shadowroot
 */
export class ShadowRoot extends DocumentFragment implements IShadowRoot {
  [$slotAssignment]: SlotAssignmentMode = "named";
  [$host]: Element;

  constructor({ host }: { host: Element }) {
    super();

    this[$host] = host;
  }
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
