import { Iterable, iterable } from "../_internals/webidl/iterable.ts";
import type { IDOMTokenList } from "../interface.d.ts";
import { OrderedSet } from "../_internals/infra/data_structures/set.ts";
import { type AttributesContext } from "../nodes/elements/element.ts";
import { getAttributeValue } from "../nodes/utils/element.ts";
import { setAttributeValue } from "../nodes/utils/set_attribute_value.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { parseOrderSet, serializeOrderSet } from "../infra/ordered_set.ts";
import { reAsciiWhitespace } from "../_internals/infra/code_point.ts";
import { LegacyPlatformObject } from "../_internals/webidl/legacy_extended_attributes.ts";
import { getter, stringifier, WebIDL } from "../_internals/webidl/idl.ts";
import { convert, DOMString } from "../_internals/webidl/types.ts";
import { range } from "../deps.ts";
import { toASCIILowerCase } from "../_internals/infra/string.ts";
import { $ } from "../internal.ts";

const $tokenSet = Symbol();

interface DOMTokenListInits {
  element: Element;
  localName: string;
}

/**
 * @see https://dom.spec.whatwg.org/#interface-domtokenlist
 */
@iterable
export class DOMTokenList extends LegacyPlatformObject
  implements IDOMTokenList {
  [k: number]: string;

  #element: Element;
  #localName: string;

  [$tokenSet]: OrderedSet<string> = new OrderedSet();

  constructor({ element, localName }: DOMTokenListInits) {
    super();
    const attributeChangeStep = (ctx: AttributesContext) => {
      if (ctx.localName === localName && ctx.namespace === null) {
        if (ctx.value === null) this[$tokenSet].empty();
        else this[$tokenSet] = parseOrderSet(ctx.value);
      }
    };
    const steps = $(element).attributeChangeSteps;
    steps.define(attributeChangeStep);

    // 1. Let element be associated element.
    this.#element = element;

    // 2. Let localName be associated attribute’s local name.
    this.#localName = localName;

    // 3. Let value be the result of getting an attribute value given element and localName.
    const value = getAttributeValue(element, localName);

    // 4. Run the attribute change steps for element, localName, value, value, and null.
    steps.run({ element, localName, oldValue: value, value, namespace: null });
  }

  [Symbol.toStringTag] = "DOMTokenList";
  [WebIDL.supportedIndexes](): Set<number> {
    return new Set(range(0, this.length));
  }
  [WebIDL.supportedNamedProperties] = undefined;

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-length
   */
  get length(): number {
    // return this’s token set’s size.
    return this[$tokenSet].size;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-item
   */
  @getter("index")
  item(index: number): string | null {
    // 1. If index is equal to or greater than this’s token set’s size, then return null.
    if (!this.isSupportedIndex(index)) return null;

    // 2. Return this’s token set[index].
    return this[$tokenSet][index]!;
  }

  contains(token: string): boolean {
    // return true if this’s token set[token] exists; otherwise false.
    return this[$tokenSet].contains(String(token));
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-add
   */
  @convert
  add(@DOMString ...tokens: readonly string[]): void {
    // 1. For each token in tokens:
    for (const token of tokens) checkToken(token); // 1. If token is the empty string, then throw a "SyntaxError" DOMException. // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.

    // 2. For each token in tokens, append token to this’s token set.
    for (const token of tokens) this[$tokenSet].append(token);

    // 3. Run the update steps.
    this.#updateSteps();
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-remove
   */
  @convert
  remove(@DOMString ...tokens: readonly string[]): void {
    // 1. For each token in tokens:
    for (const token of tokens) checkToken(token); // 1. If token is the empty string, then throw a "SyntaxError" DOMException. // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.

    // 2. For each token in tokens, remove token from this’s token set.
    for (const token of tokens) {
      this[$tokenSet].remove((item) => item === token);
    }

    // 3. Run the update steps.
    this.#updateSteps();
  }

  /**
   * @throws {DOMException}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-toggle
   */
  @convert
  toggle(@DOMString token: string, force?: boolean): boolean {
    // 1. If token is the empty string, then throw a "SyntaxError" DOMException. 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMExcepti
    checkToken(token);

    // 3. If this’s token set[token] exists, then:
    if (this[$tokenSet].contains(token)) {
      // 1. If force is either not given or is false, then remove token from this’s token set, run the update steps and return false.
      if (!force) {
        this[$tokenSet].remove((item) => item === token);
        this.#updateSteps();

        // 2. Return true.
        return false;
      }

      return true;
    }

    // 4. Otherwise, if force not given or is true, append token to this’s token set, run the update steps, and return true.
    if (force === undefined || force) {
      this[$tokenSet].append(token);
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
  @convert
  replace(@DOMString token: string, @DOMString newToken: string): boolean {
    // 1. If either token or newToken is the empty string, then throw a "SyntaxError" DOMException.
    if (token === "" || newToken === "") {
      throw new DOMException("<message>", DOMExceptionName.SyntaxError);
    }

    // 2. If either token or newToken contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.
    if (reAsciiWhitespace.test(token) || reAsciiWhitespace.test(newToken)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidCharacterError,
      );
    }

    // 3. If this’s token set does not contain token, then return false.
    if (!this[$tokenSet].contains(token)) return false;

    // 4. Replace token in this’s token set with newToken.
    this[$tokenSet].replace(token, newToken);

    // 5. Run the update steps.
    this.#updateSteps();

    // 6. Return true.
    return true;
  }

  /**
   * @throws {TypeError}
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-supports
   */
  supports(token: string): boolean {
    // 1. Let result be the return value of validation steps called with token.
    const result = this.#validationStep(token);

    // 2. Return result.
    return result;
  }

  /**
   * @throws {TypeError}
   * @see https://dom.spec.whatwg.org/#concept-domtokenlist-validation
   */
  #validationStep(token: string) {
    const tokenSet = this[$tokenSet];
    // 1. If the associated attribute’s local name does not define supported tokens, throw a TypeError.
    if (tokenSet.isEmpty) throw new TypeError("<message>");

    // 2. Let lowercase token be a copy of token, in ASCII lowercase.
    const lowercaseToken = toASCIILowerCase(token);

    // 3. If lowercase token is present in supported tokens, return true. // 4. Return false.
    return tokenSet.contains(lowercaseToken);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-domtokenlist-value
   */
  @stringifier
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

  private isSupportedIndex(index: number): boolean {
    return this[WebIDL.supportedIndexes]().has(index);
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-dtl-update
   */
  #updateSteps(): void {
    // 1. If the associated element does not have an associated attribute and token set is empty, then return.
    if ($(this.#element).attributeList.isEmpty && this[$tokenSet].isEmpty) {
      return;
    }

    // 2. Set an attribute value for the associated element using associated attribute’s local name and the result of running the ordered set serializer for token set.
    setAttributeValue(
      this.#element,
      this.#localName,
      serializeOrderSet(this[$tokenSet]),
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
function checkToken(token: string): void {
  if (token === "") {
    throw new DOMException("<message>", DOMExceptionName.SyntaxError);
  }

  // If token contains any ASCII whitespace, then throw an "InvalidCharacterError" DOMException.
  if (reAsciiWhitespace.test(token)) {
    throw new DOMException("<message>", DOMExceptionName.InvalidCharacterError);
  }
}
