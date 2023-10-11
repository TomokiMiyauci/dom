import { Constructor } from "../../../deps.ts";
import type { IHTMLOrSVGElement } from "../../../interface.d.ts";

/**
 * @see https://html.spec.whatwg.org/multipage/interaction.html#contenteditable
 */
export function HTMLOrSVGElement<T extends Constructor>(Ctor: T) {
  abstract class HTMLOrSVGElement extends Ctor implements IHTMLOrSVGElement {
    get dataset(): DOMStringMap {
      throw new Error("dataset");
    }

    get nonce(): string | undefined {
      throw new Error("nonce#getter");
    }

    set nonce(value: string | undefined) {
      throw new Error("nonce#setter");
    }

    get autofocus(): boolean {
      throw new Error("autofocus#getter");
    }

    set autofocus(value: boolean) {
      throw new Error("autofocus#setter");
    }

    get tabIndex(): number {
      throw new Error("tabIndex#getter");
    }

    set tabIndex(value: number) {
      throw new Error("tabIndex#setter");
    }

    focus(options?: FocusOptions | undefined): void {
      throw new Error("focus");
    }

    blur(): void {
      throw new Error("blur");
    }
  }

  return HTMLOrSVGElement;
}

// deno-lint-ignore no-empty-interface
export interface HTMLOrSVGElement extends IHTMLOrSVGElement {}
