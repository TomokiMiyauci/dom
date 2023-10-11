import { Constructor } from "../../deps.ts";
import type { IElementContentEditable } from "../interface.d.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/interaction.html#contenteditable
 */
export function ElementContentEditable<T extends Constructor>(Ctor: T) {
  abstract class ElementContentEditable extends Ctor
    implements IElementContentEditable {
    get contentEditable(): string {
      throw new Error("contentEditable#getter");
    }

    set contentEditable(value: string) {
      throw new Error("contentEditable#setter");
    }

    get enterKeyHint(): string {
      throw new Error("enterKeyHint#getter");
    }

    set enterKeyHint(value: string) {
      throw new Error("enterKeyHint#setter");
    }

    get isContentEditable(): boolean {
      throw new Error("isContentEditable");
    }

    get inputMode(): string {
      throw new Error("inputMode#getter");
    }

    set inputMode(value: string) {
      throw new Error("inputMode#setter");
    }
  }

  return ElementContentEditable;
}

// deno-lint-ignore no-empty-interface
export interface ElementContentEditable extends IElementContentEditable {}
