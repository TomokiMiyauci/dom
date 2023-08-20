import { Iterable, iterable } from "../webidl/iterable.ts";
import type { IDOMTokenList } from "../interface.d.ts";
import { OrderedSet } from "../infra/set.ts";
import {
  type Element,
  getAttributeValue,
  setAttributeValue,
} from "./element.ts";
import { DOMExceptionName } from "../webidl/exception.ts";
import { $attributeList } from "./internal.ts";
import { serializeOrderSet } from "../trees/ordered_set.ts";

interface DOMTokenListInits {
  element: Element;
  localName: string;
}

/**
 * @see https://dom.spec.whatwg.org/#interface-domtokenlist
 */
@iterable
export class DOMTokenList implements IDOMTokenList {
  [k: number]: string;

  #tokenSet: OrderedSet<string> = new OrderedSet();
  #element: Element;
  #localName: string;

  constructor({ element, localName }: DOMTokenListInits) {
    // 1. Let element be associated element.
    this.#element = element;

    // 2. Let localName be associated attribute’s local name.
    this.#localName = localName;

    // 3. Let value be the result of getting an attribute value given element and localName.
    const value = getAttributeValue(element, localName);

    // TODO(miyauci)
    // 4. Run the attribute change steps for element, localName, value, value, and null.
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-length
   */
  get length(): number {
    // return this’s token set’s size.
    return this.#tokenSet.size;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-item
   */
  item(index: number): string | null {
    // 1. If index is equal to or greater than this’s token set’s size, then return null.
    if (!this.#isSupportedIndex(index)) return null;

    // 2. Return this’s token set[index].
    return this.#tokenSet[index]!;
  }

  contains(token: string): boolean {
    // return true if this’s token set[token] exists; otherwise false.
    return this.#tokenSet.contains(token);
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-add
   */
  add(...tokens: readonly string[]): void {
    // 1. For each token in tokens:
    for (const token of tokens) checkToken(token); // 1. If token is the empty string, then throw a "SyntaxError" DOMException. // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.

    // 2. For each token in tokens, append token to this’s token set.
    for (const token of tokens) this.#tokenSet.append(token);

    // 3. Run the update steps.
    this.#updateSteps();
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-remove
   */
  remove(...tokens: readonly string[]): void {
    // 1. For each token in tokens:
    for (const token of tokens) checkToken(token); // 1. If token is the empty string, then throw a "SyntaxError" DOMException. // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.

    // 2. For each token in tokens, remove token from this’s token set.
    for (const token of tokens) this.#tokenSet.remove((item) => item === token);

    // 3. Run the update steps.
    this.#updateSteps();
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-toggle
   */
  toggle(token: string, force?: boolean): boolean {
    // 1. If token is the empty string, then throw a "SyntaxError" DOMException. 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMExcepti
    checkToken(token);

    // 3. If this’s token set[token] exists, then:
    if (this.#tokenSet.contains(token)) {
      // 1. If force is either not given or is false, then remove token from this’s token set, run the update steps and return false.
      if (!force) {
        this.#tokenSet.remove((item) => item === token);
        this.#updateSteps();

        // 2. Return true.
        return false;
      }

      return true;
    }

    // 4. Otherwise, if force not given or is true, append token to this’s token set, run the update steps, and return true.
    if (force === undefined || force) {
      this.#tokenSet.append(token);
      this.#updateSteps();
      return true;
    }

    // 5. Return false.
    return false;
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-replace
   */
  replace(token: string, newToken: string): boolean {
    // 1. If either token or newToken is the empty string, then throw a "SyntaxError" DOMException. 2. If either token or newToken contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.
    checkToken(token);
    checkToken(newToken);

    // 3. If this’s token set does not contain token, then return false.
    if (!this.#tokenSet.contains(token)) return false;

    // 4. Replace token in this’s token set with newToken.
    this.#tokenSet.replace(token, newToken);

    // 5. Run the update steps.
    this.#updateSteps();

    // 6. Return true.
    return true;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-supports
   */
  supports(token: string): boolean {
    throw new Error("supports");
    // 1. Let result be the return value of validation steps called with token.

    // 2. Return result.
  }

  /**
   * @see https://dom.spec.whatwg.org/#DOMTokenList-stringification-behavior
   */
  toString(): string {
    return this.value;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-value
   */
  get value(): string {
    return this.#serializeSteps();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-value
   */
  set value(value: string) {
    // set an attribute value for the associated element using associated attribute’s local name and the given value.
    setAttributeValue(this.#element, this.#localName, value);
  }

  #isSupportedIndex(index: number): boolean {
    return 0 <= index && index < this.#tokenSet.size;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-dtl-update
   */
  #updateSteps(): void {
    // 1. If the associated element does not have an associated attribute and token set is empty, then return.
    if (this.#element[$attributeList].isEmpty && this.#tokenSet.isEmpty) {
      return;
    }

    // 2. Set an attribute value for the associated element using associated attribute’s local name and the result of running the ordered set serializer for token set.
    setAttributeValue(
      this.#element,
      this.#localName,
      serializeOrderSet(this.#tokenSet),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-dtl-serialize
   */
  #serializeSteps(): string {
    return getAttributeValue(this.#element, this.#localName);
  }
}

// deno-lint-ignore no-empty-interface
export interface DOMTokenList extends Iterable<string> {}

/**
 * @throws {DOMException}
 */
export function checkToken(token: string): void {
  if (token === "") {
    throw new DOMException("<message>", DOMExceptionName.SyntaxError);
  }

  // If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.
  if (reAsciiWhitespace.test(token)) {
    new DOMException("<message>", DOMExceptionName.InvalidCharacterError);
  }
}

/** @see https://infra.spec.whatwg.org/#ascii-whitespace */
const reAsciiWhitespace = /[\t\n\f\r ]/;
