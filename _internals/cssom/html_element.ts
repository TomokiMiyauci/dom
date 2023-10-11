import { Constructor } from "../../deps.ts";
import type { IHTMLElement } from "../interface.d.ts";

type IHTMLElement_CSSOMView = Pick<
  IHTMLElement,
  | "offsetParent"
  | "offsetTop"
  | "offsetLeft"
  | "offsetWidth"
  | "offsetHeight"
>;

export function HTMLElement_CSSOMView<T extends Constructor>(Ctor: T) {
  abstract class HTMLElement_CSSOMView extends Ctor
    implements IHTMLElement_CSSOMView {
    get offsetParent(): Element | null {
      throw new Error("offsetParent");
    }

    get offsetTop(): number {
      throw new Error("offsetTop");
    }

    get offsetLeft(): number {
      throw new Error("offsetLeft");
    }

    get offsetWidth(): number {
      throw new Error("offsetWidth");
    }

    get offsetHeight(): number {
      throw new Error("offsetHeight");
    }
  }

  return HTMLElement_CSSOMView;
}

// deno-lint-ignore no-empty-interface
export interface HTMLElement_CSSOMView extends IHTMLElement_CSSOMView {}
