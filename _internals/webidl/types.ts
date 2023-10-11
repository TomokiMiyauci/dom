import "npm:reflect-metadata";
import { convertScalar } from "../infra/string.ts";
import { isNegativeZero } from "../../deps.ts";

export class MetaKey {
  static readonly Convertor = Symbol();
}

export function DOMString(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
): void {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({ index: parameterIndex, convert: String }),
    target,
    propertyKey,
  );
}

DOMString.exclude = (
  predicate: (value: unknown) => boolean,
): (
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void => {
  return (target, propertyKey, parameterIndex): void => {
    const parameters: Convertor[] = Reflect.getMetadata(
      MetaKey.Convertor,
      target,
      propertyKey,
    ) ?? [];
    const convert = (value: unknown): unknown => {
      return predicate(value) ? value : String(value);
    };

    Reflect.defineMetadata(
      MetaKey.Convertor,
      parameters.concat({ index: parameterIndex, convert }),
      target,
      propertyKey,
    );
  };
};

export interface Convertor {
  index: number;

  convert(input: unknown): unknown;
}

export function convert(
  target: object,
  prop: string | symbol,
  // deno-lint-ignore ban-types
  descriptor: { value?: Function } | { set?: Function },
): void {
  const convertors: Convertor[] = Reflect.getOwnMetadata(
    MetaKey.Convertor,
    target,
    prop,
  ) ?? [];

  const normalized = "value" in descriptor
    ? { type: "value", value: descriptor.value }
    : "set" in descriptor
    ? { type: "set", value: descriptor.set }
    : undefined;

  if (!normalized || !normalized.value) return;

  const length = normalized.value.length;

  function reducer(acc: unknown[], convertor: Convertor): unknown[] {
    // rest parameter
    if (length <= convertor.index) {
      const heads = acc.slice(0, convertor.index);
      const rests = acc.slice(convertor.index);
      const converted = rests.map(convertor.convert);

      return heads.concat(converted);
    }

    return applyConvert(acc, convertor);
  }

  const proxy = new Proxy(normalized.value, {
    apply: (target, thisArg, argArray) => {
      const converted = convertors.reduce(reducer, argArray);

      return Reflect.apply(target, thisArg, converted);
    },
  });

  Object.defineProperty(descriptor, normalized.type, { value: proxy });
}

function applyConvert(
  inputs: readonly unknown[],
  convertor: Convertor,
): unknown[] {
  const array = inputs.slice();
  const { index, convert } = convertor;

  if (index in array) {
    array[index] = convert(array[index]);
  }

  return array;
}

export function USVString(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
): void {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({ index: parameterIndex, convert: convertScalar }),
    target,
    propertyKey,
  );
}

export function unsignedLong(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
): void {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({
      index: parameterIndex,
      convert: convertToUnsignedLong,
    }),
    target,
    propertyKey,
  );
}

export function unsignedShort(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
): void {
  const parameters: Convertor[] = Reflect.getMetadata(
    MetaKey.Convertor,
    target,
    propertyKey,
  ) ?? [];

  Reflect.defineMetadata(
    MetaKey.Convertor,
    parameters.concat({
      index: parameterIndex,
      convert: convertToUnsignedShort,
    }),
    target,
    propertyKey,
  );
}

function convertToUnsignedLong(value: unknown): number {
  if (typeof value !== "number") return 0;

  const number = ConvertToInt(value, 32, "unsigned");

  // Values outside the range are not specified.
  // An implementation that passes WPT would look like this:
  if (number < 0) return value + MAX_UNSIGNED_LONG;
  if (number >= MAX_UNSIGNED_LONG) return value - MAX_UNSIGNED_LONG;

  return number;
}

function convertToUnsignedShort(value: unknown): number {
  if (typeof value !== "number") return 0;

  const number = ConvertToInt(value, 16, "unsigned");

  // Values outside the range are not specified.
  // An implementation that passes WPT would look like this:
  if (number < 0) return value + MAX_UNSIGNED_SHORT;
  if (number >= MAX_UNSIGNED_SHORT) return value - MAX_UNSIGNED_SHORT;

  return number;
}

const MAX_UNSIGNED_LONG = 2 ** 32;
const MAX_UNSIGNED_SHORT = 2 ** 16;

/**
 * @see https://webidl.spec.whatwg.org/#abstract-opdef-converttoint
 */
export function ConvertToInt(
  V: number,
  bitLength: number,
  signedness: "signed" | "unsigned",
): number {
  // 1. If bitLength is 64, then:
  // 2. Otherwise, if signedness is "unsigned", then:
  // 3. Otherwise:
  // 4. Let x be ? ToNumber(V).
  let x = Number(V);

  // 5. If x is −0, then set x to +0.
  if (isNegativeZero(x)) x = +0;

  // 8. If x is NaN, +0, +∞, or −∞, then return +0.
  if (isNaN(x) || !x || x === Infinity || x === -Infinity) return +0;

  // 9. Set x to IntegerPart(x).
  x = IntegerPart(x);

  // 10. Set x to x modulo 2bitLength.
  x = x % (2 ** bitLength);

  // 11. If signedness is "signed" and x ≥ 2bitLength − 1, then return x − 2bitLength.
  if (signedness === "signed" && x >= 2 ** (bitLength - 1)) {
    return x - (2 ** bitLength);
  }

  // 12. Otherwise, return x.
  return x;
}

/**
 * @see https://webidl.spec.whatwg.org/#abstract-opdef-integerpart
 */
export function IntegerPart(n: number): number {
  // 1. Let r be floor(abs(n)).
  const r = Math.floor(Math.abs(n));

  // 2. If n < 0, then return -1 × r.
  if (n < 0) return -1 * r;

  // 3. Otherwise, return r.
  return r;
}
