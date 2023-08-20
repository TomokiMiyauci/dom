import { Iterable, iterable } from "../webidl/iterable.ts";
import type { IDOMTokenList } from "../interface.d.ts";

/**
 * @see https://dom.spec.whatwg.org/#interface-domtokenlist
 */
@iterable
export class DOMTokenList implements IDOMTokenList {
  [k: number]: string;

  get length(): number {
    throw new Error("length");
  }

  item(index: number): string | null {
    throw new Error("item");
  }

  contains(token: string): boolean {
    throw new Error("contains");
  }

  add(...tokens: string[]): void {
    throw new Error("add");
  }

  remove(...tokens: string[]): void {
    throw new Error("remove");
  }

  toggle(token: string, force?: boolean | undefined): boolean {
    throw new Error("toggle");
  }

  replace(token: string, newToken: string): boolean {
    throw new Error("replace");
  }

  supports(token: string): boolean {
    throw new Error("supports");
  }

  get value(): string {
    throw new Error("value#getter");
  }

  set value(value: string) {
    throw new Error("value#setter");
  }
}

// deno-lint-ignore no-empty-interface
export interface DOMTokenList extends Iterable<string> {}
